import { localize } from '#runtime/svelte/helper';

export default function getBreakerProperties(item) {
  const { breakerProperties, weaponProperties } = CONFIG.A5E;

  const properties = item.system.breakerProperties
    ?.map((p) => breakerProperties[p] ?? null)
    ?.filter(Boolean)
    ?.sort((a, b) => a.localeCompare(b));

  if (properties.length) {
    return localize(
      'A5E.weaponProperties.breakerSpecific',
      { type: properties.join(', ') }
    );
  }

  return weaponProperties.breaker;
}
