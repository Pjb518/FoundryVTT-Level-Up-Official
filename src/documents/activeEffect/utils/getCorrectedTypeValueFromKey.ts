// @ts-nocheck
import castType from '../../../utils/castType';

export default function getCorrectedTypeValueFromKey(actor, key: string): any {
  const model = game.model.Actor[actor.type] ?? {};
  const actorValue = foundry.utils.getProperty(actor, key) ?? null;

  const sampleValue = game.a5e.activeEffects.options[actor.type]
    ?.allOptions?.[key]?.sampleValue ?? foundry.utils.getProperty(model, key) ?? null;

  if (actorValue === null || actorValue === undefined) return sampleValue;
  if (!sampleValue && sampleValue !== 0) return actorValue;

  const currentType = foundry.utils.getType(actorValue);
  const targetType = foundry.utils.getType(sampleValue);

  if (currentType === targetType) return actorValue;

  // Cast actorValue to the correct type
  try {
    return castType(actorValue, targetType);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      `Actor [${actor.id}] | Unable to parse active effect change for ${key}: "${actorValue}"`
    );
    return null;
  }
}
