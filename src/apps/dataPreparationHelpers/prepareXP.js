export default function prepareXP(data) {
  const cr = parseFloat(data.system.details.cr || 0);
  const baseXp = CONFIG.A5E.CR_EXP_LEVELS[parseInt(cr, 10) > 30 ? 30 : cr];

  return data.system.details.elite ? baseXp * 2 : baseXp;
}
