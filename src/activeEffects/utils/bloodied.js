// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                     Conditions Object
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// eslint-disable-next-line no-unused-vars

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
  const hasCondition = actor.statuses.has('bloodied');

  // TODO: Call hook to recharge uses on bloodied
  // Handle Application of Condition
  if (actor.type === 'character' && actor.parent === null) {
    if (isBloodied && !hasCondition) {
      const createData = foundry.utils.deepClone(condition);
      createData.label = game.i18n.localize(condition.label);
      createData.statuses = [condition.id];

      delete createData.id;
      const cls = getDocumentClass('ActiveEffect');

      cls.migrateDataSafe(createData);
      cls.cleanData(createData);
      createData.name = game.i18n.localize(createData.name);

      await cls.create(createData, { parent: actor });

      Hooks.callAll('a5e.bloodied', actor, true);
    } else if (!isBloodied && hasCondition) {
      const existing = actor.effects.reduce((arr, e) => {
        if ((e.statuses.size === 1) && e.statuses.has('bloodied')) arr.push(e.id);
        return arr;
      }, []);

      if (existing.length) await actor.deleteEmbeddedDocuments('ActiveEffect', existing);
    }
  } else if (actor.type === 'npc' && actor.token !== null) {
    if (isBloodied && !hasCondition) {
      actor.token.toggleActiveEffect(condition);
      Hooks.callAll('a5e.bloodied', actor, true);
    } else if (!isBloodied && hasCondition) actor.token.toggleActiveEffect(condition);
  }
}
