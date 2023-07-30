export default function getEffectPromptTitle(prompt) {
  // eslint-disable-next-line no-undef
  const effect = fromUuidSync(prompt.effectUuid);

  return effect.name;
}
