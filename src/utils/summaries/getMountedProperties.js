import { localize } from '#runtime/svelte/helper';

export default function getMountedProperties(item) {
  const { versatileOptions, weaponProperties } = CONFIG.A5E;

  if (item.system.mounted) {
    const mounted = versatileOptions[item.system.mounted];

    return localize(
      'A5E.weaponProperties.mountedSpecific',
      { die: mounted }
    );
  }

  return weaponProperties.mounted;
}
