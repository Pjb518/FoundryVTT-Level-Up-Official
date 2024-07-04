import { localize } from '#runtime/svelte/helper';

export default class HitDiceManager {
  #actor: typeof Actor;

  #automate: boolean;

  #max = 0;

  #value = 0;

  dieSizes = new Set<number>();

  constructor(actor: typeof Actor, automate = true) {
    this.#actor = actor;
    this.#automate = automate;

    if (this.#actor.type === 'character' && automate) {
      Object.values(this.#actor.classes).forEach((cls: any) => {
        this.#max += cls.hitDice.total;
        this.#value += cls.hitDice.total - cls.hitDice.current;
        this.dieSizes.add(cls.hitDice.size);
      });

      return;
    }

    Object.entries(this.#actor.system.attributes.hitDice as Record<string, any> ?? {})
      .forEach(([die, { current, total }]: [string, { current: number, total: number }]) => {
        const size = parseInt(die.slice(1), 10);
        this.#value += total - current;
        this.#max += total;
        this.dieSizes.add(size);
      });
  }

  get max(): number {
    return this.#max;
  }

  get value(): number {
    return this.#value;
  }

  get smallest(): number {
    return this.dieSizes.size ? Math.min(...this.dieSizes) : 0;
  }

  get largest(): number {
    return this.dieSizes.size ? Math.max(...this.dieSizes) : 0;
  }

  get bySize(): Record<string, { current: number, total: number }> {
    if (this.#actor.type === 'character' && this.#automate) {
      return Object.values(this.#actor.classes ?? {})
        .reduce((acc: Record<string, { current: number, total: number }>, cls: any) => {
          // eslint-disable-next-line max-len
          const { current, total, size }: { current: number, total: number, size: number } = cls.hitDice;
          acc[`d${size}`] ??= { current: 0, total: 0 };
          acc[`d${size}`].current += current;
          acc[`d${size}`].total += total;
          return acc;
        }, {});
    }

    const hitDiceData = this.#actor.system.attributes.hitDice as Record<
      string, { current: number, total: number }
    > ?? {};

    return hitDiceData;
  }

  async consumeHitDice(consumeData: Record<string, any>) {
    if (this.#actor.type === 'npc' || !this.#automate) {
      const { hitDice } = this.#actor.system.attributes;

      Object.entries(hitDice ?? {}).forEach(([die, { current }]) => {
        const consumeValue = consumeData[die] ?? 0;
        hitDice[die].current = Math.max(current - consumeValue, 0);
      });

      await this.#actor.update({
        'system.attributes.hitDice': hitDice
      });
    }

    const classes = this.#actor.classes ?? {} as any;
    const updates: any[] = [];

    Object.entries(consumeData ?? {}).forEach(([die, quantity]) => {
      const cls = Object.values(classes).find((c: any) => (
        c.hitDice.size === parseInt(die.slice(1), 10) && c.hitDice.current - quantity >= 0));

      if (!cls) return;

      updates.push({
        _id: cls.id,
        'system.hp.hitDiceUsed': Math.min(cls.system.hp.hitDiceUsed + quantity, cls.classLevels)
      });
    });

    await this.#actor.updateEmbeddedDocuments('Item', updates);
  }

  async rollHitDice(dieSize: string | null = null, quantity: number = 1): Promise<any> {
    const actorData = this.#actor.system;
    const conMod = parseInt(actorData.abilities.con.check.mod, 10) || 0;

    if (this.#actor.type === 'npc' || !this.#automate) {
      const { attributes } = actorData;

      if (!dieSize) return null;
      if (attributes.hitDice[dieSize].current - quantity < 0) return null;

      const formula = `${quantity}${dieSize} + ${quantity * conMod}`;

      const { hookData, chatData } = await this
        .#rollHitDice(dieSize, attributes.hitDice[dieSize].current, quantity, formula);

      this.#actor.update({
        'system.attributes': {
          [`hitDice.${dieSize}.current`]: attributes.hitDice[dieSize].current - quantity
        }
      });

      const chatCard = await ChatMessage.create(chatData);

      Hooks.callAll('a5e.rollHitDice', this.#actor, hookData);
      return chatCard;
    }

    const classes = this.#actor.classes ?? {} as any;
    let cls: any;

    if (!dieSize) {
      const die = this.largest;
      if (!die) return null;

      cls = Object.values(classes).find((c: any) => (
        c.hitDice.size === die && c.hitDice.current - quantity >= 0));

      if (!cls) return null;
    } else {
      cls = Object.values(classes)
        .find((c: any) => (
          c.hitDice.size === parseInt(dieSize.slice(1), 10) && c.hitDice.current - quantity >= 0));

      if (!cls) return null;
    }

    const { size }: { size: number } = cls.hitDice;
    const formula = `${quantity}d${size} + ${quantity * conMod}`;
    const { hookData, chatData } = await this.#rollHitDice(`d${size}`, cls.hitDice.current, quantity, formula);

    cls.update({
      'system.hp.hitDiceUsed': Math.min(cls.system.hp.hitDiceUsed + quantity, cls.classLevels)
    });

    const chatCard = await ChatMessage.create(chatData);
    Hooks.callAll('a5e.rollHitDice', this.#actor, hookData);

    return chatCard;
  }

  async #rollHitDice(
    dieSize: string,
    currentCount: number,
    quantity: number,
    formula: string
  ): Promise<{ hookData: any, chatData: any }> {
    const { attributes } = this.#actor.system;

    const roll = await new Roll(formula).roll();

    const title = localize('A5E.HitDiceChatHeader', { dieSize: dieSize.toUpperCase() });
    const chatData = {
      author: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this.#actor }),
      sound: CONFIG.sounds.dice,
      rolls: [roll],
      flags: {
        a5e: {
          actorId: this.#actor.uuid,
          img: this.#actor.token?.img ?? this.#actor.img,
          name: this.#actor.name,
          title
        }
      }
    };

    const hpDelta = Math.max(roll.total, 0);
    const maxHP = attributes.hp.max;

    this.#actor.applyHealing(hpDelta);

    const hookData = {
      dieSize,
      dieCount: currentCount - quantity,
      formula,
      newHp: Math.min(attributes.hp.value + hpDelta, maxHP),
      roll,
      quantity
    };

    return { hookData, chatData };
  }

  getUpdateData(
    { upperLimit, restoreLargest }: { upperLimit: number, restoreLargest: boolean } =
      { upperLimit: 0, restoreLargest: true }
  ): { updates: any[] | Record<string, any>, recovered: number, type: string } {
    // eslint-disable-next-line no-param-reassign
    if (!upperLimit) upperLimit = Math.max(Math.floor(this.max / 2), 1) || 1;

    if (this.#actor.type === 'character' && this.#automate) {
      const updates: any[] = [];
      let recovered = 0;

      const classes = Object.values(this.#actor.classes ?? {}).sort((a: any, b: any) => {
        if (restoreLargest) return b.hitDice.size - a.hitDice.size;
        return a.hitDice.size - b.hitDice.size;
      });

      classes.forEach((cls: any) => {
        const consumed = cls.system.hp.hitDiceUsed;
        if (consumed === 0) return;
        if (recovered >= upperLimit) return;

        const recoverable = Math.min(consumed, upperLimit - recovered);
        recovered += recoverable;
        updates.push({ _id: cls.id, 'system.hp.hitDiceUsed': consumed - recoverable });
      });

      return { updates, recovered, type: 'embedded' };
    }

    const updates: Record<string, any> = {};
    let recovered = 0;

    const hitDiceData = Object.entries(
      this.#actor.system.attributes.hitDice as Record<string, any> ?? {}
    ).sort(([a], [b]) => {
      if (restoreLargest) return parseInt(b.slice(1), 10) - parseInt(a.slice(1), 10);
      return parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10);
    });

    hitDiceData.forEach(
      ([die, { current, total }]: [string, { current: number, total: number }]) => {
        const consumed = total - current;
        if (consumed === 0) return;
        if (recovered >= upperLimit) return;

        const recoverable = Math.min(consumed, upperLimit - recovered);
        recovered += recoverable;
        updates[`system.attributes.hitDice.${die}.current`] = current + recoverable;
      }
    );

    return { updates, recovered, type: 'actor' };
  }
}
