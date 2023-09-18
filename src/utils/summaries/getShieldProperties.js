export default function getShieldProperties(item) {
  const { shieldProperties } = CONFIG.A5E;

  return item.system.shieldProperties.map(
    (property) => shieldProperties[property] ?? property
  );
}
