import MigrationBase from '../MigrationBase';

import A5E from '../../config';

export default class Migration012MigrateInitiativeBonus extends MigrationBase {
  static version = 0.012;

  #updateInitiativeBonus(actorData) {
    const { bonus } = actorData.system.attributes.initiative ?? {};
    if (!bonus) return;

    actorData.system.bonuses.initiative = {
      [foundry.utils.randomID()]: {
        context: {
          abilities: Object.keys(A5E.abilities),
          skills: Object.keys(A5E.skills)
        },
        formula: bonus.trim(),
        label: 'Initiative Bonus',
        default: true
      }
    };
  }

  async updateActor(actorData) {
    this.#updateInitiativeBonus(actorData);
  }

  async updateEffect(effectData) {
    const changes = effectData.changes ?? [];
    if (!changes.length) return;

    changes.forEach((change, idx) => {
      const { key } = change;

      if (key !== 'system.attributes.initiative.bonus') return;

      const formula = change.value ?? '';
      const bonus = {
        context: {
          abilities: Object.keys(A5E.abilities),
          skills: Object.keys(A5E.skills)
        },
        formula,
        label: 'Initiative Bonus',
        img: 'icons/svg/upgrade.svg',
        default: true
      };

      const newChange = foundry.utils.deepClone(change);
      newChange.key = 'flags.a5e.effects.bonuses.initiative';
      newChange.value = JSON.stringify(bonus);
      newChange.mode = 0;
      changes[idx] = newChange;
    });
  }
}
