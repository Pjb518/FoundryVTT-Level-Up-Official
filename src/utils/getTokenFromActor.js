import TokenDocumentA5e from '../documents/tokenDocument';

/**
 * @param {import("../documents/actor").default} actor
 * @returns {Promise<TokenDocumentA5e | undefined>} tokenDocument
 */
export default async function getTokenFromActor(actor) {
  // Check parent
  if (actor?.parent instanceof TokenDocumentA5e) {
    return actor.parent;
  }

  // Check Sheet
  if (actor.sheet && actor.sheet.token instanceof TokenDocumentA5e) {
    return actor.sheet.token;
  }

  // Fetch PC Token - We usually should be fine with fetching the token on the current
  // scene if it exists.
  const availableTokens = await actor.getActiveTokens(false, true);

  if (availableTokens.length) return availableTokens[0];

  return undefined;
}
