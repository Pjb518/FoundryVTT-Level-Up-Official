/**
 * Extend the base TokenDocument class to implement system-specific HP bar logic.
 * @extends {TokenDocument}
 */
export default class TokenDocumentA5e extends TokenDocument {
  overrides = this.overrides ?? {};

  /**
   * @override
   */
  _initialize(options) {
    // this.overrides = {};
    super._initialize(options);
    console.log('Initialzie');
  }

  /**
   * @override
   */
  prepareDerivedData() {
    super.prepareDerivedData();
    const tokenOverrides = this.overrides ?? {};
    console.log(tokenOverrides);
    foundry.utils.mergeObject(this, tokenOverrides);
  }

  /**
   * Overrides base functionality and doesn't update unlinked tokens.
   * @override
   * */
  _onUpdateBaseActor(update = {}, options = {}) {
    // Update synthetic Actor data
    if (!this.isLinked && this.delta) {
      this.delta.updateSyntheticActor();
    }

    this._onRelatedUpdate(update, options);
  }

  /** @inheritdoc */
  getBarAttribute(barName, { alternative } = {}) {
    const data = super.getBarAttribute(barName, { alternative });

    if (data && (data.attribute === 'attributes.hp')) {
      data.value += parseInt(getProperty(this.actor.system, 'attributes.hp.temp') || 0, 10);
      data.max += parseInt(getProperty(this.actor.system, 'attributes.hp.temp') || 0, 10);
    }

    return data;
  }
}
