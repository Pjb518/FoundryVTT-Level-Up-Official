export default function getClassesLabel(item) {
  const { characterClasses } = CONFIG.A5E;

  return (item.system.classes ?? [])
    .map((cls) => characterClasses[cls] ?? cls)
    .sort((a, b) => a.localeCompare(b))
    .join(', ');
}
