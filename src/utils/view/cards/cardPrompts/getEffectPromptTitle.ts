export function getEffectPromptTitle(prompt) {
  const effect = fromUuidSync(prompt.effectUuid) as ActiveEffect;

  return effect.name;
}
