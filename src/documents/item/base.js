/* eslint-disable no-continue */
/* eslint-disable no-unused-vars */
import MigrationRunnerBase from '../../migration/MigrationRunnerBase';
import getSummaryData from '../../utils/summaries/getSummaryData';

/**
 * Override and extend the basic Item implementation.
 * @extends {Item}
 */
export default class BaseItemA5e extends Item {
  /**
   * A handler for activating an item. An actionId can be passed to this method to use a specific
   * action defined on the item. If there are no actions defined, this method defaults to
   * outputting the item's description.
   *
  //  * This method accepts an options object to further customize the activation process.
   *
   * @param {string} actionId
   * @param {object options
   * @returns
   */
  async activate() {
    // Do not allow an item to activate if it not attached to an actor or if the user does
    // not have owner permissions for the actor.
    if (!this.actor || !this?.actor.isOwner) return;
    this.shareItemDescription();
  }

  async shareItemDescription(action) {
    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flags: {
        a5e: {
          actorId: this.actor.uuid,
          itemId: this.uuid,
          cardType: 'item',
          actionName: action?.name,
          actionDescription: action?.descriptionOutputs?.includes('action')
            ? await TextEditor.enrichHTML(action.description, {
              async: true,
              secrets: this.isOwner,
              relativeTo: this,
              rollData: this?.actor?.getRollData() ?? {}
            })
            : null,
          itemDescription: action?.descriptionOutputs?.includes('item') ?? true
            ? await TextEditor.enrichHTML(this.system.description, {
              async: true,
              secrets: this.isOwner,
              relativeTo: this,
              rollData: this?.actor?.getRollData() ?? {}
            })
            : null,
          unidentifiedDescription: action?.descriptionOutputs?.includes('item') ?? true
            ? await TextEditor.enrichHTML(this.system.unidentifiedDescription, {
              async: true,
              secrets: this.isOwner,
              relativeTo: this,
              rollData: this?.actor?.getRollData() ?? {}
            })
            : null,
          img: action?.img ?? this.img,
          name: this.name,
          summaryData: getSummaryData(this, action, {
            hideSpellClasses: true,
            hideSpellComponents: true,
            hideSpellLevel: true
          })
        }
      },
      content: '<article></article>'
    };

    ChatMessage.applyRollMode(chatData, game.settings.get('core', 'rollMode'));
    const chatCard = ChatMessage.create(chatData);

    Hooks.callAll('a5e.itemActivate', this, { action });
    return chatCard;
  }

  async configureItem() {
    await this.sheet.render(true);
  }

  async duplicateItem() {
    const owningActor = this.actor;
    const newItem = foundry.utils.duplicate(this);
    newItem.name = `${newItem.name} (Copy)`;

    if (owningActor) owningActor.createEmbeddedDocuments('Item', [newItem]);
    else Item.createDocuments([newItem]);
  }

  async toggleFavorite() {
    if (!this.actor) return;

    await this.update({
      'system.favorite': !this.system.favorite
    });
  }

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    // Add schema version
    if (!this.system.schemaVersion?.version && !this.system.schema?.version) {
      let version = null;
      if (typeof this.system?.equipped === 'boolean') version = 0.003;
      else if (typeof this.system?.recharge === 'string') version = 0.002;
      else if (typeof this.system?.uses?.max === 'string') version = 0.001;
      else if (this.system?.actionOptions) version = null;
      else version = MigrationRunnerBase.LATEST_SCHEMA_VERSION;

      this.updateSource({
        'this.system.schemaVersion.version': version
      });
    }
  }

  async _preUpdate(data, options, user) {
    super._onUpdate(data, options, user);
  }

  async _onCreate(data, options, user) {
    super._onCreate(data, options, user);

    // Update effect origins
    const effects = this.effects.contents;
    const updateArr = effects.map((effect) => ({ _id: effect._id, origin: this.uuid }));

    this.updateEmbeddedDocuments('ActiveEffect', updateArr);
  }

  async _onDelete(data, options, user) {
    super._onDelete(data, options, user);
  }

  static async _onCreateDocuments(items, context) {
    if (!(context.parent instanceof Actor)) return Item._onCreateDocuments(items, context);
    const toCreate = [];
    items.forEach((item) => {
      item.effects.forEach((effect) => {
        const isPassive = effect.flags?.a5e?.transferType === 'passive';
        if (!isPassive) return;

        const effectData = effect.toJSON();
        effectData.origin = item.uuid;
        toCreate.push(effectData);
      });
    });

    if (!toCreate.length) return [];
    const cls = getDocumentClass('ActiveEffect');
    cls.createDocuments(toCreate, context);

    return Item._onCreateDocuments(items, context);
  }
}
