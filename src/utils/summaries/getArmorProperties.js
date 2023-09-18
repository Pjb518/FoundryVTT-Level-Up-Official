export default function getArmorProperties(item) {
  const { armorProperties } = CONFIG.A5E;

  return item.system.armorProperties.map(
    (property) => armorProperties[property] ?? property
  );
}
