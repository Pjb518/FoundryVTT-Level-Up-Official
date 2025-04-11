import type ObjectItemA5e from "../../documents/item/object";

import { localize } from "#utils/localization/localize.ts";

export default function getVersatileProperties(item: ObjectItemA5e) {
  const { versatileOptions, weaponProperties } = CONFIG.A5E;

  if (item.system.versatile) {
    const versatile = versatileOptions[item.system.versatile];

    return localize("A5E.weaponProperties.versatileSpecific", {
      die: versatile,
    });
  }

  return weaponProperties.versatile;
}
