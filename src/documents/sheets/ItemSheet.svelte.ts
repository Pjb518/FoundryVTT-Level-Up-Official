import { SvelteApplicationMixin } from "#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts";

import ItemSheetComponent from "#view/sheets/ItemSheet.svelte";
import LimitedSheetComponent from "#view/sheets/LimitedSheet.svelte";

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
    window: {
      resizable: true,
      minimizable: true,
    },
  };

  protected override async _prepareContext() {
    return {
      item: this.item,
      sheet: this,
    };
  }

  static getSheetComponent(type: string) {
    // if (type === "archetype") return ArchetypeSheetComponent;
    // if (type === "background") return BackgroundSheetComponent;
    // if (type === "class") return ClassSheetComponent;
    // if (type === "culture") return CultureSheetComponent;
    // if (type === "destiny") return DestinySheetComponent;
    // if (type === "heritage") return HeritageSheetComponent;
    return ItemSheetComponent;
  }
}
