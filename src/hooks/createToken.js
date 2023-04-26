export default async function createToken(token, options, userId) {
  rollTokenHitDie(token, userId);
}

async function rollTokenHitDie(token, userID) {
  const { actor } = token;
  const userPlacingToken = game.users.get(userID);
  if (!actor) return;

  if (![game.user.isGM, game.user === userPlacingToken, actor.type === 'npc', game.settings.get('a5e', 'randomizeNPCHitPoints')
  ].every(Boolean)) return;

  const { hitPointFormula } = actor;

  if (hitPointFormula === null) return;

  const hpRoll = new Roll(hitPointFormula);
  await hpRoll.toMessage({ flavor: `Rolling hit points for ${token.name}.` }, { rollMode: 'gmroll' });

  // Update token with new information
  actor.update({
    'system.attributes.hp': {
      baseMax: hpRoll.total,
      value: hpRoll.total
    }
  });
}
