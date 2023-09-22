import { SvelteApplication } from '#runtime/svelte/application';

import ItemDocument from './ItemDocument';

import BackgroundSheetComponent from './sheets/BackgroundSheet.svelte';
import CultureSheetComponent from './sheets/CultureSheet.svelte';
import DestinySheetComponent from './sheets/DestinySheet.svelte';
import HeritageSheetComponent from './sheets/HeritageSheet.svelte';
import ItemSheetComponent from './sheets/ItemSheet.svelte';
import LimitedSheetComponent from './sheets/LimitedSheet.svelte';

export default class ItemSheet extends SvelteApplication {
  /**
   * @inheritDoc
   */
  constructor(item, options = {}) {
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

    super(foundry.utils.mergeObject(
      options,
      {
        baseApplication: 'ItemSheet',
        id: `item-sheet-${item.id}`,
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
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      baseApplication: 'ItemSheet',
      classes: ['a5e-sheet', 'a5e-item-sheet'],
      minimizable: true,
      svelte: {
        target: document.body
      }
    });
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
    if (dragData.type === 'Action') await this.#onDropAction(dragData);
    if (dragData.type === 'Item') await this.#onDropItem(dragData);
  }

  async #onDropAction(dragData) {
    const { actionId, itemUuid } = dragData;
    if (!actionId || !itemUuid) return;

    const document = await fromUuid(itemUuid);
    const action = document.actions.get(actionId);
    if (!action) return;

    // Change image
    action.img ??= document.img;

    this.item.actions.add(foundry.utils.duplicate(action));
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
    if (type === 'background') return BackgroundSheetComponent;
    if (type === 'culture') return CultureSheetComponent;
    if (type === 'destiny') return DestinySheetComponent;
    if (type === 'heritage') return HeritageSheetComponent;
    return ItemSheetComponent;
  }
}
