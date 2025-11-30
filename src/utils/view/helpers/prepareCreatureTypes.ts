import { localize } from "#utils/localization/localize.ts";

export function prepareCreatureTypes(data: any): string[] {
  const types = data.system.details.creatureTypes.sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase()),
  );

  const typeLabels = types.map((type) =>
    localize(CONFIG.A5E.creatureTypes[type] ?? type),
  );

  if (data.system.details.isShapechanger) {
    typeLabels.push(localize("A5E.details.creature.labels.shapechanger"));
  }

  if (data.system.details.isSquad) {
    typeLabels.push(localize("A5E.details.creature.labels.squad"));
  }

  if (data.system.details.isSwarm) {
    typeLabels.push(localize("A5E.details.creature.labels.swarm"));
  }

  return typeLabels;
}
