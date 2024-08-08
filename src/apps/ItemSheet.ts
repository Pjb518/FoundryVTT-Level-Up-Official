import { SvelteApplication } from '#runtime/svelte/application';

import ItemDocument from './ItemDocument';

import ArchetypeSheetComponent from './sheets/ArchetypeSheet.svelte';
import BackgroundSheetComponent from './sheets/BackgroundSheet.svelte';
import ClassSheetComponent from './sheets/ClassSheet.svelte';
import CultureSheetComponent from './sheets/CultureSheet.svelte';
import DestinySheetComponent from './sheets/DestinySheet.svelte';
import HeritageSheetComponent from './sheets/HeritageSheet.svelte';
import ItemSheetComponent from './sheets/ItemSheet.svelte';
import LimitedSheetComponent from './sheets/LimitedSheet.svelte';

import getDocumentSourceTooltip from '../utils/getDocumentSourceTooltip';

export default class ItemSheet extends SvelteApplication {
  public item: any;

  declare public options: any;

  /**
   * @inheritDoc
   */
  constructor(item, options: any = {}) {
    options.svelte ??= {};

    if ([
      CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE,
      CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED
    ].includes(item.permission)) {
      options.classes = ['a5e-sheet', 'a5e-sheet--item', 'a5e-actor-sheet--limited'];
      options.svelte.class = LimitedSheetComponent;
      options.width = 512;
      options.resizable = false;
    } else {
      options.svelte.class = ItemSheet.getSheetComponent(item.type);
      options.classes = ['a5e-sheet', 'a5e-sheet--item'];
      options.width = 555;
      options.height = 592;
      options.resizable = true;
    }

    // eslint-disable-next-line no-nested-ternary
    const parentId = item.parent
      ? item?.parent?.isToken
        ? (item?.parent?.parent.id ?? item.parent.id)
        : item.parent.id
      : null;

    super(foundry.utils.mergeObject(
      options,
      {
        baseApplication: 'ItemSheet',
        id: parentId ? `item-sheet-${parentId}-${item.id}` : `item-sheet-${item.id}`,
        classes: ['a5e-sheet', 'a5e-sheet--item'],
        title: item.name,
        focusAuto: item.type !== 'heritage',
        svelte: {
          props: {}
        }
      }
    ));

    this.item = item;

    this.options.svelte.props.document = new ItemDocument(
      this.item,
      { delete: this.close.bind(this) }
    );

    this.options.svelte.props.sheet = this;
  }

  /**
   * Default Application options
   *
   * @returns {object} options - Application options.
   * @see https://foundryvtt.com/api/Application.html#options
   */
  static get defaultOptions(): any {
    return foundry.utils.mergeObject(super.defaultOptions, {
      baseApplication: 'ItemSheet',
      classes: ['a5e-sheet', 'a5e-item-sheet'],
      minimizable: true,
      svelte: {
        target: document.body
      }
    });
  }

  get object() {
    return this.item;
  }

  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();

    if (!this.item.pack) {
      buttons.unshift({
        label: 'Sheet Configuration',
        class: 'configure-sheet',
        icon: 'fas fa-cog fa-fw',
        title: 'Configure Sheet',
        onclick: (event) => this._onConfigureSheet(event)
      });

      buttons.unshift({
        label: 'Revitalize',
        icon: 'fa-solid fa-arrows-rotate',
        onclick: () => this.item.revitalize()
      });
    }

    if (this.item.pack) {
      buttons.unshift({
        label: 'Import',
        class: 'import',
        icon: 'fas fa-download',
        onclick: (event) => this._onImport(event)
      });
    }
    return buttons;
  }

  _onImport(event) {
    if (event) event.preventDefault();
    return this.item.collection
      .importFromCompendium(this.item.compendium, this.item.id);
  }

  _onConfigureSheet(event) {
    if (event) event.preventDefault();

    const sheetConfigDialog = new DocumentSheetConfig(this.item, { top: this.position.top + 40 });
    sheetConfigDialog.render(true);
  }

  async _onDropDocument(dragData) {
    const types = ['archetype', 'background', 'class', 'culture', 'heritage'];
    if (types.includes(this.item.type)) {
      if (dragData.type === 'Grant') await this.#onDropGrant(dragData);
    } else {
      if (dragData.type === 'Action') await this.#onDropAction(dragData);
      if (dragData.type === 'Grant') await this.#onDropGrant(dragData);
      if (dragData.type === 'Item') await this.#onDropItem(dragData);
    }
  }

  async #onDropAction(dragData: any) {
    const { actionId, itemUuid } = dragData;
    if (!actionId || !itemUuid) return;

    const document = await fromUuid(itemUuid);
    const action = foundry.utils.duplicate(document?.actions.get(actionId));
    if (!action) return;

    // Change image
    action.img ??= document?.img;

    const [newActionId] = await this.item.actions.add(action, true, true);
    if (!newActionId) return;

    // Copy over effects from old item to new item
    const effects = Array.from(document?.effects)
      .filter((e: any) => e.flags?.a5e?.transferType === 'onUse' && e.flags?.a5e?.actionId);

    if (!effects.length) return;

    let newEffects = effects.map((e: any) => {
      const newEffect = e.toObject();
      newEffect.flags.a5e.actionId = newActionId;
      return newEffect;
    });

    newEffects = await this.item.createEmbeddedDocuments('ActiveEffect', newEffects);

    const effectPrompts = Object.entries(action.prompts ?? {})
      .filter(([, prompt]: [string, any]) => prompt.type === 'effect');

    const idMapping = effectPrompts.reduce((acc, [promptId, prompt]: [string, any]) => {
      const effect = effects.find((e: any) => e._id === prompt.effectId);
      if (!effect) return acc;

      const newEffect: any = newEffects.find((e) => e.equals(effect));
      if (!newEffect) return acc;

      acc[promptId] = newEffect._id;
      return acc;
    }, {});

    const updates = {};
    effectPrompts.forEach(([promptId]) => {
      updates[`system.actions.${newActionId}.prompts.${promptId}.effectId`] = idMapping[promptId] ?? '';
    });

    this.item.update(updates);
  }

  async #onDropGrant(dragData: Record<string, any>) {
    const { grantId, itemUuid } = dragData;
    if (!grantId || !itemUuid) return;

    const document = await fromUuid(itemUuid);
    const grant = foundry.utils.duplicate(document?.grants.get(grantId));
    if (!grant) return;

    // Change image
    grant.img ??= document?.img;

    await this.item.grants.add(grant);
  }

  async #onDropItem(dragData) {
    const { uuid } = dragData;
    const document = await fromUuid(uuid);
    if (!document) return;

    if (document.type === 'spell') this.#onDropSpell(document);
  }

  async #onDropSpell(spell) {
    // Get all actions from spell
    const actions = spell.actions.values();

    // Create copies of all the actions.
    const data = actions.map((action) => {
      action.img ??= spell.img;
      action.description ??= spell.system.description;
      action.descriptionOutputs = ['action'];
      return action;
    });

    data.forEach((a) => {
      this.item.actions.add(foundry.utils.duplicate(a));
    });
  }

  static getSheetComponent(type) {
    if (type === 'archetype') return ArchetypeSheetComponent;
    if (type === 'background') return BackgroundSheetComponent;
    if (type === 'class') return ClassSheetComponent;
    if (type === 'culture') return CultureSheetComponent;
    if (type === 'destiny') return DestinySheetComponent;
    if (type === 'heritage') return HeritageSheetComponent;
    return ItemSheetComponent;
  }

  async _render(force = false, options = {}) {
    await super._render(force, options);

    const sheet = this.element[0];
    const sheetTitle = sheet.querySelector('.window-header .window-title');

    const existingIdLink = sheetTitle.querySelector('.document-id-link');
    if (existingIdLink) return;

    const documentID = this.item.id;
    const documentUUID = this.item.uuid;
    const documentSource = CONFIG.A5E.products[this.item?.system?.source];

    if (documentSource?.abbreviation) {
      const sourceLink = document.createElement('a');
      sourceLink.classList.add('a5e-document-source-link');
      sourceLink.setAttribute('alt', documentSource?.title);
      sourceLink.dataset.tooltip = getDocumentSourceTooltip(documentSource);
      sourceLink.dataset.tooltipClass = 'a5e-tooltip a5e-tooltip--dark a5e-tooltip--document-source';
      sourceLink.dataset.tooltipDirection = 'DOWN';
      sourceLink.innerHTML = `<i class="fa-solid fa-book-open"></i> ${documentSource?.abbreviation}`;
      sourceLink.href = documentSource?.url;
      sourceLink.target = '_blank';

      sheetTitle.append(sourceLink);
    }

    const idLink = document.createElement('a');
    idLink.classList.add('document-id-link');
    idLink.setAttribute('alt', 'Copy Document ID');
    idLink.dataset.tooltip = 'Copy Document ID';
    idLink.dataset.tooltipDirection = 'UP';
    idLink.innerHTML = '<i class="fa-solid fa-passport"></i>';

    idLink.addEventListener('click', (event) => {
      event.preventDefault();
      game.clipboard.copyPlainText(documentID);
      ui.notifications.info(game.i18n.format(
        'DOCUMENT.IdCopiedClipboard',
        { label: 'Item', type: 'id', id: documentID }
      ));
    });

    idLink.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      game.clipboard.copyPlainText(documentUUID);
      ui.notifications.info(game.i18n.format(
        'DOCUMENT.IdCopiedClipboard',
        { label: 'Item', type: 'uuid', id: documentUUID }
      ));
    });

    sheetTitle.append(idLink);
  }
}
