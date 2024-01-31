import ActiveEffectA5e from './activeEffect/activeEffect';

/**
 * Extend the base TokenDocument class to implement system-specific HP bar logic.
 * @extends {TokenDocument}
 */
export default class TokenDocumentA5e extends TokenDocument {
  overrides = this.overrides ?? {};

  get scene() {
    return this.parent;
  }

  prepareBaseData() {
    this.updateTokenSize();
    super.prepareBaseData();

    this.applyActiveEffects();
  }

  applyActiveEffects() {
    this.overrides = {};
    if (!this.actor) return;

    ActiveEffectA5e.applyEffects(
      this,
      this.actor.effects?.contents ?? [],
      'afterDerived',
      null,
      (change) => change.key.startsWith('@token')
    );
  }

  updateTokenSize() {
    const { actor } = this;
    if (!actor) return;

    const { size } = actor.system.traits;
    const numericalSize = CONFIG.A5E.tokenDimensions[size];
    this.width = numericalSize;
    this.height = numericalSize;
  }

  /**
   * Overrides base functionality and doesn't update unlinked tokens.
   * @override
   * */
  _onUpdateBaseActor(update = {}, options = {}) {
    // Update synthetic Actor data
    if (!this.isLinked && this.delta) {
      this.delta.updateSyntheticActor();
      // eslint-disable-next-line no-restricted-syntax
      for (const collection of Object.values(this.delta.collections)) {
        collection.initialize({ full: true });
      }
    }

    this._onRelatedUpdate(update, options);
    this._updateCanvas(update, options);
  }

  // Update canvas if there are changes that affect the canvas
  _updateCanvas(updates, options) {
    if (!this.scene?.isInFocus && !this.scene?.isView) return;
    console.log(updates);
  }

  /** @inheritdoc */
  getBarAttribute(barName, { alternative } = {}) {
    const data = super.getBarAttribute(barName, { alternative });

    if (data && (data.attribute === 'attributes.hp')) {
      data.value += parseInt(foundry.utils.getProperty(this.actor.system, 'attributes.hp.temp') || 0, 10);
      data.max += parseInt(foundry.utils.getProperty(this.actor.system, 'attributes.hp.temp') || 0, 10);
    }

    return data;
  }
}
