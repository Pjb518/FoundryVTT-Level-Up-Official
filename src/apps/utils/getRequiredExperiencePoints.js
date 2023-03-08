export default function getRequiredExperiencePoints(actor) {
  if (actor.type === 'npc') return null;

  let { level } = actor.system.details;

  if (level < 1) level = 1;
  else if (level > 19) level = 19;

  return CONFIG.A5E.CHARACTER_EXP_LEVELS[level.toString()];
}
