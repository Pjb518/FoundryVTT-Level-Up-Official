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
          acc[`d${size}`] = { current, total };
          return acc;
        }, {});
    }

    const hitDiceData = this.#actor.system.attributes.hitDice as Record<
      string, { current: number, total: number }
    > ?? {};

    return hitDiceData;
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
