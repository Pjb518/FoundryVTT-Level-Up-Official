import { localize } from '#runtime/util/i18n';

export default function getMountedProperties(item) {
  const { versatileOptions, weaponProperties } = CONFIG.A5E;

  const properties = item.system.mounted
    ?.map((die) => versatileOptions[die] ?? null)
    ?.filter(Boolean)
    ?.sort((a, b) => {
      const regex = /d(?<die>\d+)/;
      return a.match(regex).groups.die - b.match(regex).groups.die;
    });

  if (properties.length) {
    return localize(
      'A5E.weaponProperties.mountedSpecific',
      { dice: properties.join(' / ') }
    );
  }

  return weaponProperties.mounted;
}
