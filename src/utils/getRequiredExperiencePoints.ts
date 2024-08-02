import type { BaseActorA5e } from '../documents/actor/base';

export default function getRequiredExperiencePoints(actor: BaseActorA5e): number {
  if (actor.isType('character')) {
    let level = actor.levels?.character ?? 1;

    if (level < 1) level = 1;
    else if (level > 19) level = 19;

    return CONFIG.A5E.CHARACTER_EXP_LEVELS[level.toString()] ?? 0;
  }

  return 0;
}
