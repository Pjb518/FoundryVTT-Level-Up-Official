export default function getSpellComponentsLabel(item) {
  const components = Object.entries(item.system.components).reduce(
    (acc, [component, hasComponent]) => {
      if (hasComponent) acc.push(CONFIG.A5E.spellComponentAbbreviations[component]);

      return acc;
    },
    []
  ).join(', ');

  if (item?.system?.materials?.trim()) return `${components} (${item?.system?.materials})`;

  return components;
}
