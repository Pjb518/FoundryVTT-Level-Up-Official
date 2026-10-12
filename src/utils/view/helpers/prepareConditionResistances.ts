const EXPERTISE_SIDES = { 1: 4, 2: 6, 3: 8, 4: 10, 5: 12, 6: 20 };

export function prepareConditionResistances(data: any) {
  const resistances = Object.values(data.system.traits.conditionResistances ?? {});

  const summaries: string[] = resistances.flatMap(
    ({ condition, custom, rollMode, expertiseDice, bonus }: any) => {
      if (!condition) return [];

      const parts: string[] = [];

      if (rollMode === 1) {
        parts.push(game.i18n.localize("A5E.traits.headings.conditions.resistanceColumns.advantage"));
      } else if (rollMode === -1) {
        parts.push(game.i18n.localize("A5E.traits.headings.conditions.resistanceColumns.disadvantage"));
      }

      if (EXPERTISE_SIDES[expertiseDice]) {
        parts.push(`1d${EXPERTISE_SIDES[expertiseDice]}`);
      }

      if (bonus) parts.push(bonus > 0 ? `+${bonus}` : `${bonus}`);
      if (!parts.length) return [];

      const label =
        !custom && CONFIG.A5E.conditions[condition]
          ? game.i18n.localize(CONFIG.A5E.conditions[condition])
          : condition;

      return `${label} (${parts.join(", ")})`;
    },
  );

  summaries.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  return summaries;
}
