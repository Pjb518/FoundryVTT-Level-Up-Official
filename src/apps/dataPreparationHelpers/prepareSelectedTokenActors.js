export default function prepareSelectedTokenActors() {
  const selectedTokens = canvas?.tokens?.controlled;
  if (!selectedTokens?.length) return [];

  const tokenActors = selectedTokens.map((t) => t.document.actor);
  return tokenActors;
}
