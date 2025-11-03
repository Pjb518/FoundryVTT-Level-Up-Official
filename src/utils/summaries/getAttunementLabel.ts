import type ObjectItemA5e from "../../documents/item/object";

import { localize } from "#utils/localization/localize.ts";

export default function getAttunementLabel(item: ObjectItemA5e) {
  const { requiresAttunement, attuned, attunementHint } = item.system;

  if (!requiresAttunement) return "";
  if (attuned) return localize("A5E.Attuned");
  if (!item.actor) {
    if (!attunementHint) return localize("A5E.attunement.headings.requiredPrompt");
    return `${localize("A5E.attunement.headings.requiredPrompt")} ${attunementHint}`;
  }

  return `${localize("A5E.attunement.headings.requiredPrompt")} - ${localize("A5E.AttunedNot")}`;
}
