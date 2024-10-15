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

    this.#updates.actor['system.attributes.inebriated'] = 0;

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
    const resources = ['primary', 'secondary', 'tertiary', 'quaternary'];

    Object.entries(this.#actor.system.resources ?? {}).forEach(([slug, r]) => {
      if (!this.restTypes.includes(r.per) || !r.max) return;

      const max = getDeterministicBonus(r.max, this.#actor.getRollData());

      if (resources.includes(slug)) {
        this.#updates.actor[`system.resources.${slug}.value`] = max;
      } else {
        this.#updates.actor[`system.resources.classResources.${slug}`] = max;
      }
    });
  }

  #restoreHitDice() {
    const { updates, type } = this.#actor.HitDiceManager.getUpdateData();
    if (type === 'actor') this.#updates.actor = foundry.utils.mergeObject(this.#updates.actor, updates);
    if (type === 'embedded') this.#updates.items = this.#updates.items.concat(updates);
  }

  #restoreHitPoints() {
    const { max, bonus } = this.#actor.system.attributes.hp;

    this.#updates.actor['system.attributes.hp'] = {
      bonus: 0, value: max - bonus, temp: 0
    };
  }

  #restoreUses() {
    const items = Array.from(this.#actor.items);

    items.forEach((item) => {
      const rollData = this.#actor.getRollData(item);
      const { uses } = item.system;
      const updates = { _id: item.id };

      // Restore action uses
      if (item.actions) {
        item.actions.entries().forEach(([id, action]) => {
          const actionUses = action.uses ?? {};

          if (!this.restTypes.includes(actionUses?.per) || !actionUses?.max) return;

          updates[`system.actions.${id}.uses.value`] = getDeterministicBonus(actionUses.max, rollData);
        });
      }

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
