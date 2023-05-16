// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                     Conditions Object
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// eslint-disable-next-line no-unused-vars
import ActorA5e from '../../documents/actor';

/**
 * Apply the bloodied condition to token on half hp
 * @param {ActorA5e} actor
 * @param {Object} changes
 */
export default async function automateBloodied(actor, changes) {
  // Guard for non-gm users
  if (!game.user.isGM) return;

  // Guard for non hp changes.
  if (!changes?.system?.attributes?.hp) return;

  const { value, max } = actor.system.attributes.hp;
  const condition = CONFIG.statusEffects.find((c) => c.id === 'bloodied');
  if (!condition) return;

  const isBloodied = (value <= (max / 2));
  const hasCondition = actor.effects.find((c) => c.statuses.has('bloodied'));

  // TODO: Call hook to recharge uses on bloodied
  // Handle Application of Condition
  if (actor.type === 'character' && actor.parent === null) {
    if (isBloodied && !hasCondition) {
      const createData = foundry.utils.deepClone(condition);
      createData.label = game.i18n.localize(condition.label);
      createData['flags.core.statusId'] = condition.id;
      const cls = getDocumentClass('ActiveEffect');
      await cls.create(createData, { parent: actor });
    } else if (!isBloodied && hasCondition) {
      await hasCondition.delete();
    }
  } else if (actor.type === 'npc' && actor.token !== null) {
    if (isBloodied && !hasCondition) actor.token.toggleActiveEffect(condition);
    else if (!isBloodied && hasCondition) actor.token.toggleActiveEffect(condition);
  }
}
