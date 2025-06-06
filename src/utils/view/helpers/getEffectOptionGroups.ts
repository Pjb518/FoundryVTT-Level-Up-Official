import { localize } from "#utils/localization/localize.ts";

export function getEffectOptionGroups(optionsList: any) {
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
    {},
  );

  const groups = options.map((option) => ({
    label: option.label as string,
    key: option.effectKey as string,
    group: localize(
      CONFIG.A5E.effectKeyGroups[groupMap[option.effectKey] ?? "other"]
        ?.label ?? "Other",
    ),
  }));

  groups.sort((a, b) => a.group.localeCompare(b.group));

  return groups;
}
