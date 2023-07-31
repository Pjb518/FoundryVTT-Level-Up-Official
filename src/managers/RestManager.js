import getDeterministicBonus from '../dice/getDeterministicBonus';

export default class RestManager {
  #actor;

  #restData;

  #type;

  #updates;

  constructor(actor, restData) {
    this.#actor = actor;
    this.#restData = restData;
    this.#type = restData.restType ?? 'short';

    this.#updates = { actor: {}, effects: [], items: [] };
  }

  get restTypes() {
    if (this.#type === 'long') {
      return ['shortRest', 'recharge', 'round', 'turn', 'minute', 'hour', 'longRest', 'day'];
    }

    return ['shortRest', 'recharge', 'round', 'turn', 'minute', 'hour'];
  }

  async restoreResources() {
    const {
      consumeSupply, haven, recoverStrifeAndFatigue, restType
    } = this.#restData;

    // Restore long rest resources
    if (this.#type === 'long') {
      this.#adjustStrifeAndFatigue();
      this.#restoreHitDice();
      this.#restoreHitPoints();
      await this.#removeTemporaryActiveEffects();
    }

    // Optionally consume supply
    if (consumeSupply) this.#consumeSupply();

    // Restore short rest resources
    this.#restoreGenericResources();
    this.#restoreExertion();
    this.#restoreSpellResources();
    this.#restoreUses();

    // Call pre-hook

    // Update documents
    await this.#actor.update(this.#updates.actor);
    await this.#actor.updateEmbeddedDocuments('Item', this.#updates.items);

    // Call Hook
    Hooks.callAll('a5e.restCompleted', this, {
      consumeSupply, haven, restType, recoverStrifeAndFatigue
    });
  }

  #adjustStrifeAndFatigue() {
    const { haven, recoverStrifeAndFatigue } = this.#restData;
    const { strife, fatigue } = this.#actor.system.attributes;

    if (!recoverStrifeAndFatigue) {
      this.#updates.actor['system.attributes.fatigue'] = fatigue + 1;
    } else if (!haven) {
      this.#updates.actor['system.attributes.fatigue'] = fatigue === 1 ? 0 : fatigue;
      this.#updates.actor['system.attributes.strife'] = strife === 1 ? 0 : strife;
    } else {
      this.#updates.actor['system.attributes.fatigue'] = Math.max(fatigue - 1, 0);
      this.#updates.actor['system.attributes.strife'] = Math.max(strife - 1, 0);
    }
  }

  #consumeSupply() {
    this.#updates.actor['system.supply'] = Math.max(this.#actor.system.supply - 1, 0);
  }

  #restoreExertion() {
    const { exertion } = this.#actor.system.attributes;
    if (!exertion?.recoverOnRest) return;

    this.#updates.actor['system.attributes.exertion.current'] = exertion.max;
  }

  #restoreGenericResources() {
    ['primary', 'secondary', 'tertiary', 'quaternary'].forEach((r) => {
      const resource = this.#actor.system.resources[r];
      if (!this.restTypes.includes(resource.per) || !resource.max) return;

      this.#updates.actor[`system.resources.${r}.value`] = getDeterministicBonus(resource.max, this.#actor.getRollData());
    });
  }

  #restoreHitDice() {
    const { hitDice } = this.#actor.system.attributes;

    const expendedHitDice = Object.entries(hitDice).reduce((acc, [die, { current, total }]) => {
      acc[die] = Math.max(total - current, 0);
      return acc;
    }, {});

    const expendedHitDiceQuantity = Object.values(expendedHitDice)
      .reduce((count, curr) => count + curr, 0);

    const totalHitDiceQuantity = Object.values(hitDice)
      .reduce((count, { total: curr }) => count + curr, 0);

    const quantityToRecover = Math.floor(totalHitDiceQuantity / 2) || 1;

    if (quantityToRecover >= expendedHitDiceQuantity) {
      this.#updates.actor['system.attributes.hitDice'] = {
        'd6.current': hitDice.d6.total,
        'd8.current': hitDice.d8.total,
        'd10.current': hitDice.d10.total,
        'd12.current': hitDice.d12.total
      };
    } else {
      for (let i = 0; i < quantityToRecover; i += 1) {
        // eslint-disable-next-line no-restricted-syntax
        for (const dieSize of Object.keys(hitDice).reverse()) {
          if (expendedHitDice[dieSize] > 0) {
            if (!this.#updates.actor[`system.attributes.hitDice.${dieSize}.current`]) {
              this.#updates.actor[`system.attributes.hitDice.${dieSize}.current`] = hitDice[dieSize].current + 1;
            } else {
              this.#updates.actor[`system.attributes.hitDice.${dieSize}.current`] += 1;
            }

            expendedHitDice[dieSize] -= 1;
            break;
          }
        }
      }
    }
  }

  #restoreHitPoints() {
    const { baseMax } = this.#actor.system.attributes.hp;

    this.#updates.actor['system.attributes.hp'] = {
      bonus: 0, value: baseMax, temp: 0
    };
  }

  #restoreUses() {
    const items = Array.from(this.#actor.items);
    const rollData = this.#actor.getRollData();

    items.forEach((item) => {
      const { uses } = item.system;
      const updates = { _id: item.id };

      // Restore action uses
      item.actions.entries().forEach(([id, action]) => {
        const actionUses = action.uses ?? {};

        if (!this.restTypes.includes(actionUses?.per) || !actionUses?.max) return;

        updates[`system.actions.${id}.uses.value`] = getDeterministicBonus(actionUses.max, rollData);
      });

      // Restore Item uses
      if (!this.restTypes.includes(uses?.per) || !uses?.max) {
        if (Object.keys(updates).length < 2) return;

        this.#updates.items.push(updates);
        return;
      }

      updates['system.uses.value'] = getDeterministicBonus(uses.max, rollData);
      this.#updates.items.push(updates);
    });
  }

  #restoreSpellResources() {
    const { spellResources } = this.#actor.system;
    const flags = this.#actor?.flags?.a5e ?? {};
    const restoreSpellPointsOnShortRest = flags?.restoreSpellPointsOnShortRest ?? true;
    const restoreSpellSlotsOnShortRest = flags?.restoreSpellSlotsOnShortRest ?? false;

    if (this.#type === 'long' || restoreSpellPointsOnShortRest) {
      this.#updates.actor['system.spellResources.points.current'] = Math.max(spellResources.points.max, 0);
    }

    if (this.#type === 'long' || restoreSpellSlotsOnShortRest) {
      Object.entries(spellResources.slots ?? {}).forEach(([level, { max }]) => {
        this.#updates.actor[`system.spellResources.slots.${level}.current`] = Math.max(max, 0);
      });
    }
  }

  async #removeTemporaryActiveEffects() {
    if (!(game.settings.get('a5e', 'removeActiveEffectsOnLongRest'))) return;

    const effects = Array.from(this.#actor.effects)
      .filter((e) => e.flags?.a5e?.transferType === 'onUse');

    if (!effects.length) return;
    await this.#actor.deleteEmbeddedDocuments('ActiveEffect', effects.map((e) => e.id));
  }
}
