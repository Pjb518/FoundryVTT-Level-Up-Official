export default function prepareXP(actor) {
  const cr = parseFloat(actor?.system?.details?.cr || 0);
  let baseXp = 0;

  if (cr === 0.125) baseXp = CONFIG.A5E.CR_EXP_LEVELS['1/8'];
  else if (cr === 0.25) baseXp = CONFIG.A5E.CR_EXP_LEVELS['1/4'];
  else if (cr === 0.5) baseXp = CONFIG.A5E.CR_EXP_LEVELS['1/2'];
  else baseXp = CONFIG.A5E.CR_EXP_LEVELS[parseInt(cr, 10) > 30 ? 30 : cr];

  const xp = actor?.system?.details?.elite ? baseXp * 2 : baseXp;

  return xp.toLocaleString();
}
