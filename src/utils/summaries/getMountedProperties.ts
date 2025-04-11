import type ObjectItemA5e from "../../documents/item/object";

import { localize } from "#utils/localization/localize.ts";

export default function getMountedProperties(item: ObjectItemA5e) {
  const { versatileOptions, weaponProperties } = CONFIG.A5E;

  const properties = item.system.mounted
    ?.map((die) => versatileOptions[die] ?? null)
    ?.filter(Boolean)
    ?.sort((a, b) => {
      const regex = /d(?<die>\d+)/;
      return a.match(regex).groups.die - b.match(regex).groups.die;
    });

  if (properties.length) {
    return localize("A5E.weaponProperties.mountedSpecific", {
      dice: properties.join(" / "),
    });
  }

  return weaponProperties.mounted;
}
