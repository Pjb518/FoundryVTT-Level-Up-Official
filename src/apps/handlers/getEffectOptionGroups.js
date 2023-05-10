export default function getEffectOptionGroups(optionsList) {
  const options = Object.values(optionsList);

  // Invert the effectKeyGroups array so that each effect key points to a group. The config
  // object cannot be used directly, as it may contain invalid keys.
  const groupMap = Object.entries(CONFIG.A5E.effectKeyGroups).reduce(
    (acc, [group, { items }]) => {
      items.forEach((item) => {
        acc[item] = group;
      });

      return acc;
    },
    {}
  );

  // Use the currently valid keys to construct groups from the groupMap. If a key does not
  // have a group defined, put it in the "other" category.
  const groups = Object.entries(
    options.reduce((acc, curr) => {
      const group = groupMap[curr.fieldOption] ?? 'other';

      acc[group] ??= [];
      acc[group].push(curr);

      return acc;
    }, {})
  );

  // Sort the groups alphabetically
  groups.sort((a, b) => a[0].localeCompare(b[0]));

  // Shunt the "other" category to the end.
  groups.push(
    groups.splice(
      groups.findIndex((item) => item[0] === 'other'),
      1
    )[0]
  );

  return groups;
}
