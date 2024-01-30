// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                     Conditions Object
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// eslint-disable-next-line no-unused-vars

/**
 * Apply the bloodied condition to token on half hp
 * @param {ActorA5e} actor
 * @param {Object} changes
 */
export default async function automateHpConditions(actor, changes, userId, conditionId) {
  // Guard for non-gm users
  if (game.user.id !== userId) return;

  // eslint-disable-next-line no-param-reassign
  conditionId = actor.type === 'npc' && conditionId === 'unconscious' ? 'dead' : conditionId;

  // Guard for non hp changes.
  if (!changes?.system?.attributes?.hp) return;

  const { value, max } = actor.system.attributes.hp;
  const condition = CONFIG.statusEffects.find((c) => c.id === conditionId);
  if (!condition) return;

  const isApplicable = conditionId === 'bloodied'
    ? (value <= (max / 2)) && (value > 0)
    : (value <= 0);
  const overlay = ['unconscious', 'dead'].includes(conditionId);
  const hasCondition = actor.statuses.has(conditionId);

  // TODO: Call hook to recharge uses on bloodied
  // Handle Application of Condition
  if (actor.prototypeToken.actorLink && actor.parent === null) {
    if (isApplicable && !hasCondition) {
      const createData = foundry.utils.deepClone(condition);
      createData.label = game.i18n.localize(condition.label);
      createData.statuses = [condition.id];

      delete createData.id;
      const cls = getDocumentClass('ActiveEffect');

      cls.migrateDataSafe(createData);
      cls.cleanData(createData);
      createData.name = game.i18n.localize(createData.name);

      await cls.create(createData, { parent: actor });

      Hooks.callAll(`a5e.${conditionId}`, actor, true);
    } else if (!isApplicable && hasCondition) {
      const existing = actor.effects.reduce((arr, e) => {
        if ((e.statuses.size === 1) && e.statuses.has(conditionId)) arr.push(e.id);
        return arr;
      }, []);

      if (existing.length) await actor.deleteEmbeddedDocuments('ActiveEffect', existing);
    }
  } else if (actor.type === 'npc' && actor.token !== null) {
    if (isApplicable && !hasCondition) {
      actor.token.toggleActiveEffect(condition, { overlay });
      Hooks.callAll(`a5e.${conditionId}`, actor, true);
    } else if (!isApplicable && hasCondition) {
      actor.token.toggleActiveEffect(condition, { overlay });
    }
  }
}
