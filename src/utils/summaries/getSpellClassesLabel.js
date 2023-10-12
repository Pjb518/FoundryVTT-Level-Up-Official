import { localize } from '#runtime/svelte/helper';

export default function getClassesLabel(item) {
  const { classSpellLists } = CONFIG.A5E;
  const classes = [...(item.system.classes ?? [])];
  const elements = [];

  const elementMap = [
    ['elementalistAir', 'Air'],
    ['elementalistEarth', 'Earth'],
    ['elementalistFire', 'Fire'],
    ['elementalistWater', 'Water']
  ];

  elementMap.forEach(([elementalistType, element]) => {
    if (classes.includes(elementalistType)) {
      elements.push(element);
      classes.splice(classes.indexOf(elementalistType), 1);
    }
  });

  if (elements.length === 4) {
    classes.push(localize('A5E.characterClasses.elementalistCustom', { elements: 'All' }));
  } else if (elements.length) {
    classes.push(localize('A5E.characterClasses.elementalistCustom', { elements: elements.join(', ') }));
  }

  return classes
    .map((cls) => classSpellLists[cls] ?? cls)
    .sort((a, b) => a.localeCompare(b))
    .join(', ');
}
