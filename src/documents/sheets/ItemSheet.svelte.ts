import { SvelteApplicationMixin } from "#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts";
import getDocumentSourceTooltip from "#utils/getDocumentSourceTooltip.ts";

import ItemSheetComponent from "#view/sheets/ItemSheet.svelte";
import LimitedSheetComponent from "#view/sheets/LimitedSheet.svelte";
import OriginSheet from "#view/sheets/OriginSheet.svelte";

export default class ItemSheet extends SvelteApplicationMixin(
  foundry.applications.sheets.ItemSheetV2,
) {
  protected root;

  constructor(item: { document: any }, options: any = {}) {
    let root: any;

    if (
      [
        CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE,
        CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED,
      ].includes(item.document.permission)
    ) {
      options.classes = [
        "a5e-sheet",
        "a5e-sheet--item",
        "a5e-sheet--item-limited",
      ];
      root = LimitedSheetComponent;
      options.position = { width: 512, height: "auto" };
      options.window = { resizable: false };
    } else {
      root = ItemSheet.getSheetComponent(item.document.type);
      options.classes = ["a5e-sheet", "a5e-sheet--item"];
      options.resizable = true;
    }

    super(
      // @ts-expect-error
      foundry.utils.mergeObject(options, {
        document: item.document,
      }),
    );

    this.root = root;
  }

  static override DEFAULT_OPTIONS = {
    baseApplication: "ItemSheet",
    classes: ["a5e-sheet", "a5e-sheet--item"],
    position: { width: 555, height: 592 },
    actions: {
      openSourceLink: ItemSheet.#onSourceLinkClick,
    },
    window: {
      resizable: true,
      minimizable: true,
    },
  };

  protected override async _prepareContext() {
    const context = await super._prepareContext();

    return {
      ...context,
      item: this.item,
      sheet: this,
    };
  }

  async _onDropDocument(dragData: Record<string, any>) {
    const types = ["archetype", "background", "class", "culture", "heritage"];
    if (types.includes(this.item.type)) {
      if (dragData.type === "Grant") await this.#onDropGrant(dragData);
    } else {
      if (dragData.type === "Action") await this.#onDropAction(dragData);
      if (dragData.type === "Grant") await this.#onDropGrant(dragData);
      if (dragData.type === "Item") await this.#onDropItem(dragData);
    }
  }

  async #onDropAction(dragData: any) {
    const { actionId, itemUuid } = dragData;
    if (!actionId || !itemUuid) return;

    const document = (await fromUuid(itemUuid)) as Item;
    const action = document?.actions.get(actionId)?.toObject();
    if (!action) return;

    // Change image
    action.img = document?.img;

    // Copy over effects from old item to new item
    const effects = [...action.effects]
      .map((id) => document.effects.get(id)?.toObject())
      .filter((e) => !!e);

    if (effects.length) {
      const effectIds = (
        await this.item.createEmbeddedDocuments("ActiveEffect", effects)
      ).map((e) => e.id);

      action.effects = effectIds;
    }

    (this.item as Item).actions.add(action);
  }

  async #onDropGrant(dragData: Record<string, any>) {
    const { grantId, itemUuid } = dragData;
    if (!grantId || !itemUuid) return;

    const document = (await fromUuid(itemUuid)) as Item;
    const grant = foundry.utils.duplicate(document?.grants.get(grantId));
    if (!grant) return;

    // Change image
    grant.img ??= document?.img;

    await (this.item as Item).grants.add(grant);
  }

  async #onDropItem(dragData: Record<string, any>) {
    const { uuid } = dragData;
    const document = (await fromUuid(uuid)) as Item;
    if (!document) return;

    // @ts-expect-error
    if (document.isType("spell")) this.#onDropSpell(document as Item);
  }

  async #onDropSpell(spell: Item) {
    // Get all actions from spell
    const actions = [...spell.actions.values()];

    // Create copies of all the actions.
    for await (const action of actions) {
      const actionData = action.toObject();

      actionData.img = spell.img;
      actionData.description ??= spell.system.description;
      actionData.descriptionOutputs = ["action"];

      // Copy over effects from old item to new item
      const effects = [...actionData.effects]
        .map((id) => spell.effects.get(id)?.toObject())
        .filter((e) => !!e);

      if (effects.length) {
        const effectIds = (
          await this.item.createEmbeddedDocuments("ActiveEffect", effects)
        ).map((e) => e.id);

        actionData.effects = effectIds;
      }

      this.item.actions.add(actionData);
    }
  }

  async _renderFrame(options) {
    const frame = await super._renderFrame(options);
    if (!this.hasFrame) return frame;

    const docSource = CONFIG.A5E.products?.[this.item?.system.source];
    if (docSource) {
      const sourceLink = document.createElement("button");
      sourceLink.classList.add("header-control");
      sourceLink.classList.add("a5e-document-source-link");
      sourceLink.dataset.action = "openSourceLink";
      sourceLink.dataset.tooltip = getDocumentSourceTooltip(docSource);
      sourceLink.dataset.tooltipClass =
        "a5e-tooltip a5e-tooltip--dark a5e-tooltip--document-source";
      sourceLink.dataset.tooltipDirection = "DOWN";
      sourceLink.dataset.url = docSource.url;
      sourceLink.innerHTML = `<i class="fa-solid fa-book-open"></i> ${docSource?.abbreviation}`;

      this.window.title.insertAdjacentElement("afterend", sourceLink);
    }

    return frame;
  }

  static #onSourceLinkClick(event, target) {
    const url = target.dataset.url;
    if (!url) return;
    window.open(url, "_blank")?.focus();
  }

  static getSheetComponent(type: string) {
    if (type === "archetype") return OriginSheet;
    if (type === "background") return OriginSheet;
    if (type === "class") return OriginSheet;
    if (type === "culture") return OriginSheet;
    if (type === "destiny") return OriginSheet;
    if (type === "heritage") return OriginSheet;
    return ItemSheetComponent;
  }
}
