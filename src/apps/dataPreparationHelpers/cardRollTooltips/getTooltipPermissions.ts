import type { BaseActorA5e } from '../../../documents/actor/base';

export default function getTooltipPermissions(message: ChatMessage) {
  if (!game.settings.get('a5e', 'protectRolls')) return true;

  const actorId = message?.flags?.a5e?.actorId;
  const actor = fromUuidSync(actorId) as BaseActorA5e;

  if (!actor) return true;
  if (actor.type === 'character') return true;

  // If actor permissions are at least "Observer", show the tooltip
  return actor.permission >= 2;
}
