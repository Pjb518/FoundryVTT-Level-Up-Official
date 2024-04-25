export default function getRequiredExperiencePoints(actor: any): number {
  if (actor.type === 'npc') return 0;

  let level = actor.levels.character;

  if (level < 1) level = 1;
  else if (level > 19) level = 19;

  return CONFIG.A5E.CHARACTER_EXP_LEVELS[level.toString()] ?? 0;
}
