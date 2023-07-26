async function rollTokenHitDie(token, userID) {
  const { actor } = token;
  const userPlacingToken = game.users.get(userID);
  if (!actor) return;

  // Prevent non-GMs from rolling HP for NPCs
  if (!game.user.isGM) return;
  if (game.user !== userPlacingToken) return;

  // Don't roll HP for PCs
  if (actor.type !== 'npc') return;

  // Respect local and global settings for randomizing HP
  if (!game.settings.get('a5e', 'randomizeNPCHitPoints')) return;
  if (actor.flags?.a5e?.disableRandomizedHP) return;

  const { hitPointFormula } = actor;

  if (hitPointFormula === null) return;

  const hpRoll = new Roll(hitPointFormula);
  if (!(game.settings.get('a5e', 'hideRandomizedHPRolls'))) {
    await hpRoll.toMessage(
      { flavor: `Rolling hit points for ${token.name}.` },
      { rollMode: 'gmroll' }
    );
  } else await hpRoll.evaluate({ async: true });

  // Update token with new information
  actor.update({
    'system.attributes.hp': {
      baseMax: hpRoll.total,
      value: hpRoll.total
    }
  });
}

export default async function createToken(token, options, userId) {
  rollTokenHitDie(token, userId);
}
