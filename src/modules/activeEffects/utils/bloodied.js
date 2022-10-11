// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                     Conditions Object
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export default async function automateBloodied(actor, changes) {
  // Guard for non hp changes.
  if (!changes?.system?.attributes?.hp) return;

  const { value, max } = actor.system.attributes.hp;
  const condition = CONFIG.statusEffects.find((c) => c.id === 'bloodied');
  if (!condition) return;

  const isBloodied = (value <= (max / 2));
  const hasCondition = actor.effects.find((c) => c.flags?.core?.statusId === 'bloodied');

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
