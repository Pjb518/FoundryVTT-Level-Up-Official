import { localize } from '#runtime/util/i18n';

export default function getDefensiveProperties(item) {
  const { defensiveProperties, weaponProperties } = CONFIG.A5E;

  if (item.system.defensiveProperties) {
    const properties = defensiveProperties[item.system.defensiveProperties];

    return localize(
      'A5E.weaponProperties.defensiveSpecific',
      { type: properties }
    );
  }

  return weaponProperties.defensive;
}
