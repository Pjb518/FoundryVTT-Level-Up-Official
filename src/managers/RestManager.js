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

  #adjustStrifeAndFatigue() { }

  #consumeSupply() { }

  #restoreExertion() { }

  #restoreGenericResources() { }

  #restoreHitDice() { }

  #restoreHitPoints() { }

  #restoreUses() { }

  #restoreSpellResources() { }
}
