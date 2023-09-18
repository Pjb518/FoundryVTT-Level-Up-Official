export default function getWeaponProperties(item) {
  const { weaponProperties } = CONFIG.A5E;

  return item.system.weaponProperties.map(
    (property) => weaponProperties[property] ?? property
  );
}
