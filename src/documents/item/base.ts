/* eslint-disable no-continue */
/* eslint-disable no-unused-vars */

import type { Action } from 'types/action';
import type { BaseActorA5e } from '../actor/base';
import type { RevitalizeOptions } from './data';

import MigrationRunnerBase from '../../migration/MigrationRunnerBase';
import getSummaryData from '../../utils/summaries/getSummaryData';

type SystemItemTypes = Exclude<foundry.documents.BaseItem.TypeNames, 'base'>;

interface BaseItemA5e<ItemType extends SystemItemTypes = SystemItemTypes> {
  type: ItemType;
  system: DataModelConfig['Item'][ItemType];
  parent: BaseActorA5e
}

/**
 * Override and extend the basic Item implementation.
 * @extends {Item}
 */
class BaseItemA5e extends Item {
  dialogs: {
    actions: Record<string, any>;
    areaScaling: Record<string, any>;
    rollScaling: Record<string, any>;
    targetScaling: Record<string, any>;
  };

  constructor(data, context) {
    super(data, context);

    this.dialogs ??= {
      actions: {},
      areaScaling: {},
      rollScaling: {},
      targetScaling: {}
    };
  }

  // *****************************************************************************************
  isType<TypeName extends SystemItemTypes>(type: TypeName): this is BaseItemA5e<TypeName> {
    return type === this.type as SystemItemTypes;
  }

  // *****************************************************************************************
  get sourceId(): string | null {
    // @ts-expect-error
    return this._stats.compendiumSource || this.flags.core?.sourceId || null;
  }

  // *****************************************************************************************
  override prepareBaseData() { }

  override prepareDerivedData() { }

  /** @inheritdoc */
  override getRollData() {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async activate(actionId: string, options: Record<string, any>) {
    // Do not allow an item to activate if it not attached to an actor or if the user does
    // not have owner permissions for the actor.
    if (!this.actor || !this?.actor.isOwner) return;
    this.shareItemDescription(null);
  }

  async shareItemDescription(action: Action | null = null) {
    const chatData = {
      author: (game as Game).user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
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
            // @ts-expect-error
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
    await this.sheet?.render(true);
  }

  duplicateItem() {
    const owningActor = this.actor;
    const newItem = foundry.utils.duplicate(this);
    newItem.name = `${newItem.name} (Copy)`;

    if (newItem.type === 'object') {
      // @ts-expect-error
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

  async revitalize(options: RevitalizeOptions = {}): Promise<Record<string, any> | null> {
    // Confirmation Dialog
    const confirm = await foundry.applications.api.DialogV2.confirm({
      // @ts-expect-error
      window: { title: `Confirm Revitalize - ${this.name}` },
      content: '<p>Confirm updating item from compendium source?</p>',
      modal: true
    });

    if (!confirm) return null;

    options.notify ??= true;
    options.update ??= true;
    options.updateImg ??= true;
    options.updateEffects ??= true;
    options.updateName ??= true;

    const { sourceId } = this;

    // TODO: Revitalize - Try to find source

    if (!sourceId) {
      if (options.notify !== false) {
        ui.notifications?.error('Cannot revitalize an item without a source ID.');
      }

      return null;
    }

    if (this.uuid === sourceId) {
      if (options.notify !== false) {
        ui.notifications?.error('Cannot revitalize an item that is already the source.');
      }

      return null;
    }

    if (!sourceId.startsWith('Compendium.')) {
      if (options.notify !== false) {
        ui.notifications?.error('Cannot revitalize an item that is not from a compendium.');
      }

      return null;
    }

    const currentData = this.toObject();
    const compendiumData = ((await fromUuid(sourceId)) as BaseItemA5e | null)?.toObject();

    if (!compendiumData) {
      if (options.notify !== false) {
        ui.notifications?.error('Unable to find source.');
      }
      return null;
    }

    if (currentData.type !== compendiumData.type) {
      if (options.notify !== false) {
        ui.notifications?.error('Cannot revitalize an item with a different type.');
      }

      return null;
    }

    const updates: Record<string, any> = {
      name: options.updateName ? compendiumData.name : currentData.name,
      img: options.updateImg ? compendiumData.img : currentData.img,
      system: foundry.utils.deepClone(compendiumData.system),
      _stats: { compendiumSource: sourceId }
    };

    // TODO: Revitalize - Add support for grants
    // Don't update grants
    // @ts-expect-error
    if (this.system?.grants) updates.system.grants = this.system.grants;

    // Ignore favorite state
    updates.system.favorite = this.system.favorite;

    // Ignore current uses
    // @ts-expect-error
    if (this.system.uses?.max) {
      // @ts-expect-error
      updates.system.uses.value = this.system.uses.value;
    }

    // Don't update some properties for archetypes
    if (this.isType('archetype')) {
      updates.system.spellcasting.ability.base = this.system.spellcasting.ability.base;
    }

    // Don't update some properties for classes
    if (this.isType('class')) {
      updates.system.classLevels = this.system.classLevels;
      updates.system.hp = this.system.hp;
      updates.system.spellcasting.ability.base = this.system.spellcasting.ability.base;
    }

    // Don't update some properties for objects
    if (this.isType('object')) {
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
    }

    // Don't update some properties for spells
    if (this.isType('spell')) {
      updates.system.spellBook = this.system.spellBook;
    }

    // TODO: Don't update some action properties
    // @ts-expect-error
    if (compendiumData.system.actions) {
      // @ts-expect-error
      const currentActions = this.system.actions;
      // @ts-expect-error
      const compendiaActions = compendiumData.system.actions;

      const updatedActions = Object.entries(compendiaActions).reduce((acc, [actionId, action]) => {
        const updatedAction = foundry.utils.deepClone(action) as Record<string, any>;

        const existing = currentActions[actionId];

        if (!existing) {
          acc[actionId] = updatedAction;
          return acc;
        }

        // Ignore current action uses
        // @ts-expect-error
        if (action.uses?.value) {
          foundry.utils.setProperty(updatedAction, 'uses.value', existing.uses?.value);
        }

        acc[actionId] = updatedAction;
        return acc;
      }, {});

      updates.system.actions = updatedActions;
    }

    // Update effects
    if (options.updateEffects) {
      const currentEffects = [...this.effects];
      // @ts-expect-error
      const compendiaEffects = [...compendiumData.effects] as ActiveEffect[];

      const updatedEffects = compendiaEffects.reduce((acc, effect) => {
        const updatedEffect = foundry.utils.deepClone(effect);

        const existing = currentEffects.find((e) => e._id === effect._id);
        if (!existing) {
          acc.push(updatedEffect);
          return acc;
        }

        // Ignore flags
        updatedEffect.flags = existing.flags;

        acc.push(updatedEffect);
        return acc;
      }, [] as ActiveEffect[]);

      updates.effects = updatedEffects;
    }

    if (options.update) {
      await this.update(updates, { diff: false, recursive: false });
    }

    if (options.notify !== false) ui.notifications?.info('Item revitalized.');

    return updates;
  }

  /** @inheritdoc */
  override async _preCreate(data, options, user): Promise<boolean | void> {
    await super._preCreate(data, options, user);

    // Add schema version
    // @ts-expect-error
    if (!this.system.schemaVersion?.version && !this.system.schema?.version) {
      let version = null;
      // @ts-expect-error
      if (typeof this.system?.equipped === 'boolean') version = 0.003;
      // @ts-expect-error
      else if (typeof this.system?.recharge === 'string') version = 0.002;
      // @ts-expect-error
      else if (typeof this.system?.uses?.max === 'string') version = 0.001;
      // @ts-expect-error
      else if (this.system?.actionOptions) version = null;
      else version = MigrationRunnerBase.LATEST_SCHEMA_VERSION;

      this.updateSource({
        // @ts-expect-error
        'this.system.schemaVersion.version': version
      });
    }
  }

  override async _preUpdate(data, options, user): Promise<boolean | void> {
    super._preUpdate(data, options, user);
  }

  override _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
    if (userId !== game.userId) return;

    // Update effect origins
    const effects = this.effects.contents;
    const updateArr = effects.map((effect) => ({ _id: effect._id, origin: this.uuid }));

    this.updateEmbeddedDocuments('ActiveEffect', updateArr);
  }

  override _onDelete(options, user) {
    super._onDelete(options, user);
  }

  static async _onCreateOperation(documents, operation, user) {
    // @ts-expect-error
    if (game.user?.id !== user.id) return Item._onCreateOperation(documents, operation, user);

    // eslint-disable-next-line no-undef
    const parent = fromUuidSync(operation.parentUuid) ?? {};
    if (!(parent instanceof Actor)) {
      // @ts-expect-error
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

    // @ts-expect-error
    if (!toCreate.length) return Item._onCreateOperation(documents, operation, user);
    const cls = getDocumentClass('ActiveEffect');
    await cls.createDocuments(toCreate, operation);

    // @ts-expect-error
    return Item._onCreateOperation(documents, operation, user);
  }
}

// eslint-disable-next-line import/prefer-default-export
export { BaseItemA5e };
