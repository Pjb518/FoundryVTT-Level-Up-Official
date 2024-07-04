/* eslint-disable no-continue */
/* eslint-disable no-unused-vars */

import MigrationRunnerBase from '../../migration/MigrationRunnerBase';
import getSummaryData from '../../utils/summaries/getSummaryData';

/**
 * Override and extend the basic Item implementation.
 * @extends {Item}
 */
export default class BaseItemA5e extends Item {
  dialogs: {
    actions: Record<string, any>;
    areaScaling: Record<string, any>;
    rollScaling: Record<string, any>;
    targetScaling: Record<string, any>;
  };

  constructor(...args) {
    super(...args);

    this.dialogs ??= {
      actions: {},
      areaScaling: {},
      rollScaling: {},
      targetScaling: {}
    };
  }

  // *****************************************************************************************
  get sourceId(): string | null {
    return this._stats.compendiumSource?.id || this.flags.core?.sourceId || null;
  }

  // *****************************************************************************************
  prepareBaseData() { }

  prepareDerivedData() { }

  /** @inheritdoc */
  getRollData() {
    const data = { ...super.getRollData() };

    return data;
  }

  // *****************************************************************************************
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
    this.shareItemDescription(null);
  }

  async shareItemDescription(action) {
    const chatData = {
      author: (game as Game).user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flags: {
        a5e: {
          actorId: this.actor?.uuid,
          itemId: this.uuid,
          cardType: 'item',
          actionName: action?.name,
          actionDescription: action?.descriptionOutputs?.includes('action')
            ? await TextEditor.enrichHTML(action.description, {
              secrets: this.isOwner,
              relativeTo: this,
              rollData: this?.actor?.getRollData(this) ?? {}
            })
            : null,
          itemDescription: action?.descriptionOutputs?.includes('item') ?? true
            ? await TextEditor.enrichHTML(this.system.description, {
              secrets: this.isOwner,
              relativeTo: this,
              rollData: this?.actor?.getRollData(this) ?? {}
            })
            : null,
          unidentifiedDescription: action?.descriptionOutputs?.includes('item') ?? true
            ? await TextEditor.enrichHTML(this.system.unidentifiedDescription, {
              secrets: this.isOwner,
              relativeTo: this,
              rollData: this?.actor?.getRollData(this) ?? {}
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

    if (newItem.type === 'object') {
      newItem.system.containerId = null;
    }

    if (owningActor) owningActor.createEmbeddedDocuments('Item', [newItem]);
    else Item.createDocuments([newItem]);
  }

  async toggleFavorite() {
    if (!this.actor) return;

    await this.update({
      'system.favorite': !this.system.favorite
    });
  }

  async revitalize(options: Record<string, any> = {}): Promise<this | null> {
    const { sourceId } = this;

    if (!sourceId) {
      if (options.notify !== false) ui.notifications?.error('Cannot revitalize an item without a source ID.');
      return null;
    }

    if (this.uuid === sourceId) {
      if (options.notify !== false) ui.notifications?.error('Cannot revitalize an item that is already the source.');
      return null;
    }

    if (!sourceId.startsWith('Compendium.')) {
      if (options.notify !== false) ui.notifications?.error('Cannot revitalize an item that is not from a compendium.');
      return null;
    }

    options.name ??= true;
    options.update ??= true;
    options.notify ??= true;

    const currentData = this.toObject();
    const compendiumData = (await fromUuid(sourceId))?.toObject();

    if (!compendiumData) {
      if (options.notify !== false) ui.notifications?.error('Unable to find source.');
      return null;
    }

    if (currentData.type !== compendiumData.type) {
      if (options.notify !== false) ui.notifications?.error('Cannot revitalize an item with a different type.');
      return null;
    }

    const updates: Record<string, any> = {
      name: options.name ? compendiumData.name : currentData.name,
      img: compendiumData.img,
      system: foundry.utils.deepClone(compendiumData.system)
    };

    // TODO: Revitalize - Add support for grants
    // Don't update grants
    if (this.system?.grants) updates.system.grants = this.system.grants;

    // Ignore favorite state
    updates.system.favorite = this.system.favorite;

    // Don't update some properties for objects
    if (this.type === 'object') {
      // Ignore container data
      updates.system.containerId = this.system.containerId;
      updates.system.items = this.system.items;

      // Ignore states
      updates.system.damagedState = this.system.damagedState;
      updates.system.equippedState = this.system.equippedState;
      updates.system.unidentified = this.system.unidentified;

      // Ignore proficiency
      updates.system.proficient = this.system.proficient;

      // Ignore quantity
      updates.system.quantity = this.system.quantity;

      // Ignore current uses
      updates.system.uses.value = this.system.uses.value;
    }

    if (options.update) await this.update(updates, { diff: false, recursive: false });

    if (options.notify !== false) ui.notifications?.info('Item revitalized.');

    return this;
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
    super._preUpdate(data, options, user);
  }

  async _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
    if (userId !== game.userId) return;

    // Update effect origins
    const effects = this.effects.contents;
    const updateArr = effects.map((effect) => ({ _id: effect._id, origin: this.uuid }));

    this.updateEmbeddedDocuments('ActiveEffect', updateArr);
  }

  async _onDelete(data, options, user) {
    super._onDelete(data, options, user);
  }

  static async _onCreateOperation(documents, operation, user) {
    if (game.user.id !== user.id) return Item._onCreateOperation(documents, operation, user);

    // eslint-disable-next-line no-undef
    const parent = fromUuidSync(operation.parentUuid) ?? {};
    if (!(parent instanceof Actor)) {
      return Item._onCreateOperation(documents, operation, user);
    }

    const toCreate: any[] = [];
    documents.forEach((item) => {
      item.effects.forEach((effect) => {
        const isPassive = effect.flags?.a5e?.transferType === 'passive';
        if (!isPassive) return;

        const effectData = effect.toObject();
        effectData.origin = item.uuid;
        toCreate.push(effectData);
      });
    });

    if (!toCreate.length) return Item._onCreateOperation(documents, operation, user);
    const cls = getDocumentClass('ActiveEffect');
    await cls.createDocuments(toCreate, operation);

    return Item._onCreateOperation(documents, operation, user);
  }
}
