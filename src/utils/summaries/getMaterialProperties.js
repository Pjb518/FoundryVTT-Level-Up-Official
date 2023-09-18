export default function getMaterialPropertiesSummary(item) {
  const { materialProperties } = CONFIG.A5E;

  return item.system.materialProperties.map(
    (property) => materialProperties[property] ?? property
  );
}
