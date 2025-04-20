export function prepareConditionImmunities(data: any) {
  const conditionImmunities: string[] =
    data.system.traits.conditionImmunities.map(
      (condition) =>
        game.i18n.localize(CONFIG.A5E.conditions[condition]) ?? condition,
    );

  conditionImmunities.sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase()),
  );
  return conditionImmunities;
}
