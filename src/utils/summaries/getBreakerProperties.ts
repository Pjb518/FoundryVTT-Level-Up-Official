import type ObjectItemA5e from "../../documents/item/object";

import { localize } from "#utils/localization/localize.ts";

export default function getBreakerProperties(item: ObjectItemA5e) {
  const { breakerProperties, weaponProperties } = CONFIG.A5E;

  const properties = item.system.breakerProperties
    ?.map((p) => breakerProperties[p] ?? null)
    ?.filter(Boolean)
    ?.sort((a, b) => a.localeCompare(b));

  if (properties.length) {
    return localize("A5E.weaponProperties.breakerSpecific", {
      type: properties.join(", "),
    });
  }

  return weaponProperties.breaker;
}
