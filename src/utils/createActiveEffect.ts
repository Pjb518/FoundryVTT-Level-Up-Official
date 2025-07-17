import { localize } from "#utils/localization/localize.ts";

import { ActionsManager } from "#managers/ActionsManager.ts";

type Options = {
  effectType?: "onUse" | "passive" | "inactive";
  actionId?: string;
};

export async function createEffect(
  document: Actor | Item,
  { effectType, actionId }: Options = {},
) {
  const action = document?.actions?.get(actionId) ?? {};

  const updateData = {
    name: localize("A5E.effects.new"),
    icon:
      document.documentName === "Item"
        ? (action?.img ?? document.img)
        : "icons/svg/aura.svg",
    origin: document.uuid,
  };

  if (document.documentName === "Item") {
    updateData.transfer = false;
    if (effectType === "onUse") {
      if (!actionId) {
        ui.notifications.error(
          localize("A5E.notifications.effects.noActionId"),
        );
        return;
      }

      // Set related flags
      foundry.utils.setProperty(updateData, "system.effectType", "onUse");
    } else {
      foundry.utils.setProperty(updateData, "system.effectType", "passive");
    }
  }

  if (effectType === "inactive") updateData.disabled = true;

  const documents = await document.createEmbeddedDocuments("ActiveEffect", [
    updateData,
  ]);
  documents.forEach((d) => d?.sheet?.render(true));

  // Create prompt on action for effect
  if (effectType === "onUse") {
    if (!action) return;
    ActionsManager.addEffect(document, actionId, documents[0].id);
  }
}
