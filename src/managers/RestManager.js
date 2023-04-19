export default class RestManager {
  #actor;

  #restData;

  #type;

  #updates;

  constructor(actor, restData) {
    this.#actor = actor;
    this.#restData = restData;
    this.#type = restData.restType ?? 'short';

    this.#updates = { actor: {}, effects: {}, items: {} };
  }

  get restTypes() {
    const data = ['shortRest', 'recharge', 'round', 'turn', 'minute', 'hour'];
    if (this.type === 'long') data.push('longRest', 'day');
    return data;
  }

  async restoreResources() {
    const { consumeSupply } = this.#restData;

    // Restore long rest resources
    if (this.#type === 'long') {
      this.#adjustStrifeAndFatigue();
      this.#restoreHitDice();
      this.#restoreHitPoints();
    }

    // Optionally consume supply
    if (consumeSupply) this.#consumeSupply();

    // Restore short rest resources
    this.#restoreGenericResources();
    this.#restoreExertion();
    this.#restoreSpellResources();
    this.#restoreUses();

    // Call pre-hook

    // Update

    // Call Hook
  }

  #adjustStrifeAndFatigue() {
    const { haven, supply } = this.#restData;
    const { strife, fatigue } = this.#actor.system.attributes;

    if (!supply) {
      this.#updates.actor['system.attributes.fatigue'] = fatigue + 1;
    } else if (!haven) {
      this.#updates.actor['system.attributes.fatigue'] = fatigue === 1 ? 0 : fatigue;
      this.#updates.actor['system.attributes.strife'] = strife === 1 ? 0 : strife;
    } else {
      this.#updates.actor['system.attributes.fatigue'] = Math.max(fatigue - 1, 0);
      this.#updates.actor['system.attributes.fatigue'] = Math.max(strife - 1, 0);
    }
  }

  #consumeSupply() {
    this.#updates.actor['system.supply'] = Math.max(this.#actor.system.supply, 0);
  }

  #restoreExertion() {
    const { exertion } = this.#actor.system.attributes;
    if (!exertion?.recoverOnRest) return;

    this.#updates.actor['system.attributes.exertion.current'] = exertion.max;
  }

  #restoreGenericResources() { }

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
    const { baseMax } = this.system.attributes.hp;

    this.#updates.actor['system.attributes.hp'] = {
      bonus: 0, value: baseMax, temp: 0
    };
  }

  #restoreUses() { }

  #restoreSpellResources() {
    const { spellResources } = this.#actor.system;

    this.#updates.actor['system.spellResources.points.current'] = Math.max(spellResources.points.max, 0);

    if (this.#type === 'long') {
      Object.entries(spellResources.slots ?? {}).forEach(([level, { max }]) => {
        this.#updates.actor[`system.spellResources.slots.${level}.current`] = Math.max(max, 0);
      });
    }
  }
}
