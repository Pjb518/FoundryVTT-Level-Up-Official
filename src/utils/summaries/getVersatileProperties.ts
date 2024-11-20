import type ObjectItemA5e from '../../documents/item/object';

import { localize } from '#runtime/util/i18n';

export default function getVersatileProperties(item: ObjectItemA5e) {
  const { versatileOptions, weaponProperties } = CONFIG.A5E;

  if (item.system.versatile) {
    const versatile = versatileOptions[item.system.versatile];

    return localize(
      'A5E.weaponProperties.versatileSpecific',
      { die: versatile }
    );
  }

  return weaponProperties.versatile;
}
