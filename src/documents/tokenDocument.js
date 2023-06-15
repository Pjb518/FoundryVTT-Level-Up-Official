import ActiveEffectA5e from './activeEffect/activeEffect';

/**
 * Extend the base TokenDocument class to implement system-specific HP bar logic.
 * @extends {TokenDocument}
 */
export default class TokenDocumentA5e extends TokenDocument {
  overrides = this.overrides ?? {};

  /**
   * @override
   */
  prepareDerivedData() {
    super.prepareDerivedData();
    this.applyActiveEffects();
  }

  applyActiveEffects() {
    this.overrides = {};

    const effects = this.actor.effects.contents.reduce((acc, e) => {
      const modifiedEffect = foundry.utils.deepClone(e);
      modifiedEffect.changes = modifiedEffect.changes.filter((c) => c.key.startsWith('@token'));
      if (modifiedEffect.changes.length > 0) acc.push(modifiedEffect);

      return acc;
    }, []);

    ActiveEffectA5e.applyEffects(
      this,
      effects,
      'afterDerived',
      null,
      () => true
    );
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
