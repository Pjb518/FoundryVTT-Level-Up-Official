import getBreakerProperties from './getBreakerProperties';
import getDefensiveProperties from './getDefensiveProperties';
import getVersatileProperties from './getVersatileProperties';

export default function getWeaponProperties(item) {
  const { weaponProperties } = CONFIG.A5E;

  return item.system.weaponProperties
    .map((property) => {
      switch (property) {
        case 'defensive':
          return getDefensiveProperties(item);
        case 'breaker':
          return getBreakerProperties(item);
        case 'versatile':
          return getVersatileProperties(item);
        default:
          return weaponProperties[property] ?? null;
      }
    })
    .filter(Boolean);
}
