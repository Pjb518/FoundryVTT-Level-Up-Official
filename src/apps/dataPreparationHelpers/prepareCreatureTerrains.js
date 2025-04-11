import { localize } from "#utils/localization/localize.ts";

export default function prepareCreatureTerrains(actor) {
  if (actor.type !== "npc") return [];

  const terrains = actor.system.details.terrain.sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase()),
  );

  return terrains.map((terrain) =>
    localize(CONFIG.A5E.terrainTypes[terrain] ?? terrain),
  );
}
