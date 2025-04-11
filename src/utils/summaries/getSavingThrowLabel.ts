import type { Action } from "types/action";

import { localize } from "#utils/localization/localize.ts";

export default function getSavingThrowLabel(action: Action) {
  if (foundry.utils.isEmpty(action)) return "";

  const prompts = action?.prompts;
  if (foundry.utils.isEmpty(prompts) || Object.keys(prompts).length > 1)
    return null;

  const savingThrowLabel = Object.values(prompts ?? {})
    .reduce((acc, prompt) => {
      if (prompt.type !== "savingThrow") return acc;

      // @ts-expect-error
      const onSave = prompt.onSave;
      // @ts-expect-error
      const ability = prompt.ability;

      if (onSave)
        acc.push(`${localize(CONFIG.A5E.abilities[ability])} (${onSave})`);
      else acc.push(`${localize(CONFIG.A5E.abilities[ability])}`);

      return acc;
    }, [] as string[])
    .join(", ");

  return savingThrowLabel;
}
