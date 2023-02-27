/**
 * Extend the base TokenDocument class to implement system-specific HP bar logic.
 * @extends {TokenDocument}
 */
export default class TokenDocumentA5e extends TokenDocument {
  /**
   * Overrides base functionality and doesn't update unlinked tokens.
   * @override
   * */
  _onUpdateBaseActor(update = {}, options = {}) {
    // Update synthetic Actor data
    // if (!this.isLinked) {
    //   update = foundry.utils.mergeObject(update, this.actorData, {
    //     insertKeys: false,
    //     insertValues: false,
    //     inplace: false
    //   });
    //   this.actor.updateSource(update, options);
    // }

    // Update tracked Combat resource
    const c = this.combatant;
    if (c && foundry.utils.hasProperty(update.system || {}, game.combat.settings.resource)) {
      c.updateResource();
      ui.combat.render();
    }

    // Trigger redraws on the token
    if (this.parent.isView) {
      this.object.drawBars();
      if ('effects' in update) {
        this.object.drawEffects();
      }
    }
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
