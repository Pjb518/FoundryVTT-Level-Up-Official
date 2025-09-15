import { SvelteApplicationMixin } from "#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts";
import {
  actorSheetTempSettings,
  type ActorSheetTempSetting,
} from "#stores/ActorSheetTempSettingsStore.svelte.ts";

import ActorSheetComponent from "#view/sheets/ActorSheet.svelte";

export default class ActorSheet extends SvelteApplicationMixin(
  foundry.applications.sheets.ActorSheetV2,
) {
  public actor: any;

  declare public options: any;

  public tempSettings: any;

  protected root;

  constructor(actor: { document: any }, options: any = {}) {
    let root;

    if (
      [
        CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE,
        CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED,
      ].includes(actor.document.permission)
    ) {
      options.classes = [
        "a5e-sheet",
        "a5e-sheet--actor",
        "a5e-sheet--actor-limited",
      ];
      options.position = { width: 512, height: "auto" };
      options.window = { resizable: false };
      root = null;
    } else {
      root = ActorSheetComponent;
    }

    super(
      // @ts-expect-error
      foundry.utils.mergeObject(options, {
        document: actor.document,
      }),
    );

    this.root = root;
    this.actor = actor.document.isToken
      ? actor.document.parent?.actor
      : actor.document;

    actorSheetTempSettings[this.actor.uuid] ??= {} as ActorSheetTempSetting;

    this.tempSettings = actorSheetTempSettings[this.actor.uuid];
  }

  static override DEFAULT_OPTIONS = {
    baseApplication: "ActorSheet",
    classes: ["a5e-sheet", "a5e-sheet--actor"],
    position: { width: 755, height: 706 },
    window: {
      resizable: true,
      minimizable: true,
    },
  };

  protected override async _prepareContext() {
    return {
      actor: this.actor,
      sheet: this,
    };
  }

  _sortEmbeddedAlphabetically(
    docs: any[],
    documentName: "Item" | "ActiveEffect",
    reverse = false,
  ) {
    const entities = [...docs];
    entities.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    );

    if (reverse) entities.reverse();

    const updateData = entities.map((entity, idx) => ({
      _id: entity.id,
      sort: idx,
    }));

    this.document.updateEmbeddedDocuments(documentName, updateData);
  }

  override async _onDragStart(event: DragEvent) {
    const target = event.currentTarget!;
    if ("link" in event.target?.dataset) return;
    let dragData;

    // Owned Items
    if (target.dataset.itemId) {
      const item = this.actor.items.get(target.dataset.itemId);
      dragData = item.toDragData();
    }

    // Active Effect
    if (target.dataset.effectId) {
      const effect = this.actor.effects.get(target.dataset.effectId);
      dragData = effect.toDragData();
    }

    // Set data transfer
    if (!dragData) return;
    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }

  override async _onDropItem(event: DragEvent, item: Item) {
    const options = await this.#getDragOptions(event);

    if (!this.actor.isOwner) return;
    if (this.actor.uuid === item.parent?.uuid)
      return this._onSortItem(event, item);

    if (item.type === "destiny") return this.#onDropDestiny(item);
    if (item.type === "object") return this.#onDropObject(item, options);
    if (item.type === "spell") return this.#onDropSpell(item, options);

    const keepId = !this.actor.items.has(item.id);
    await Item.implementation.create(item.toObject(), {
      parent: this.actor,
      keepId,
    });
  }

  async #onDropDestiny(item: Item) {
    if (item.type !== "destiny") return;
    if (this.actor.type !== "character") {
      ui.notifications.warn(
        "Destiny documents can only be added to Characters.",
      );
      return;
    }

    await this.actor.setFlag("a5e", "destinyFulfilled", false);

    const uuids = [
      item.system.sourceOfInspiration,
      item.system.inspirationFeature,
    ];

    const features = (
      await Promise.all(uuids.map((uuid) => fromUuid(uuid)))
    ).filter((f) => f);

    await this.actor.createEmbeddedDocuments("Item", [item, ...features]);
  }

  // TODO: Fix this
  async #onDropObject(item: Item, options: DragDropOptions) {
    if (item?.parent?.id === this.actor.id) {
      item.updateContainer(options.containerUuid ?? "");
      return;
    }

    const i = item.toObject() as any;
    i.system.containerId = options.containerUuid ?? "";
    (
      await this.actor.createEmbeddedDocuments("Item", [i])
    )?.[0]?.updateContainer(options.containerUuid ?? "");
  }

  async #onDropSpell(item: Item, options: DragDropOptions) {
    const currentTab = this.tempSettings[this.actor.uuid]?.currentTab;

    // Create Spell Scroll
    if (currentTab === "inventory") {
      const spellLevel = item.system.level;

      const { attackBonus, cost, craftingComponent, saveDC, rarity } =
        CONFIG.A5E.scrollData[spellLevel];

      const scroll = {
        name: `Spell Scroll (${item.name})`,
        img: "icons/sundries/scrolls/scroll-writing-brown-gold.webp",
        type: "object",
        system: {
          actions: {},
          craftingComponents: craftingComponent,
          description: item.system.description,
          price: cost,
          objectType: "consumable",
          rarity,
        },
      };

      scroll.system.actions = [...item.actions.values()].reduce(
        (actions, _action) => {
          const action = { ..._action };

          action.prompts = Object.entries(action?.prompts ?? {}).reduce(
            (prompts, [key, _prompt]: [string, any]): object => {
              const prompt = { ..._prompt };

              if (prompt.type === "savingThrow") {
                prompt.saveDC.type = "custom";
                prompt.saveDC.bonus = saveDC;
              }

              prompts[key] = prompt;

              return prompts;
            },
            {},
          );

          action.rolls = Object.entries(action?.rolls ?? {}).reduce(
            (rolls, [key, _roll]: [string, any]): object => {
              const roll = { ..._roll };

              if (roll.type === "attack") {
                roll.ability = "none";
                roll.bonus = attackBonus.toString(10);
              }

              if (roll.scaling) {
                delete roll.scaling;
              }

              rolls[key] = roll;

              return rolls;
            },
            {},
          );

          action.consumers = {
            [foundry.utils.randomID()]: {
              itemId: "",
              quantity: 1,
              type: "quantity",
            },
          };

          actions[foundry.utils.randomID()] = action;
          return actions;
        },
        {},
      );

      const createdItem = (
        await this.actor.createEmbeddedDocuments("Item", [scroll])
      )?.[0];
      if (!createdItem) return;

      // Set itemId on consumer
      const updateData = {};
      Object.entries(createdItem.system.actions).forEach(
        ([actionId, action]: [string, any]) => {
          Object.entries(action.consumers ?? {}).forEach(([consumerId]) => {
            updateData[
              `system.actions.${actionId}.consumers.${consumerId}.itemId`
            ] = createdItem.id;
          });
        },
      );

      createdItem.update(updateData);
    }

    // Update SpellBook Id
    const { spellBookId } = options;

    if (spellBookId) {
      const spellBook = this.actor.spellBooks.get(spellBookId);
      spellBook?.addSpell(item);
    } else {
      ui.notifications.warn("No Spell Book selected.");
    }

    return;
  }

  async #getDragOptions(event: DragEvent) {
    const transferData = event.dataTransfer?.getData("text/plain");
    if (!transferData) {
      throw new Error("No transfer data found");
    }

    const dragData = JSON.parse(transferData);
    const options = {} as DragDropOptions;

    const currentSpellBook: string =
      this.tempSettings[this.actor.uuid]?.currentSpellBook ??
      Object.keys(this.actor?.system?.spellBooks)?.[0];

    const target = event.target?.closest(".a5e-item");
    const targetUUID = target?.getAttribute("data-document-uuid");
    const targetItem = await fromUuid(targetUUID);

    if (targetItem?.system?.objectType === "container") {
      options.containerUuid = targetUUID ?? "";
    }

    options.spellBookId = currentSpellBook;
    options.actionId = dragData.actionId;
    return options;
  }
}

interface DragDropOptions {
  actionId?: string;
  spellBookId?: string;
  containerUuid?: string;
}
