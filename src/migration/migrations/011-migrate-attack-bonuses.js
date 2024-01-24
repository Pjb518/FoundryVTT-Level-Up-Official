import MigrationBase from '../MigrationBase';

import A5E from '../../config';

export default class Migration011MigrateAttackBonuses extends MigrationBase {
  static version = 0.011;

  #effectKeys = new Set([
    'system.bonuses.meleeSpellAttack',
    'system.bonuses.meleeWeaponAttack',
    'system.bonuses.rangedSpellAttack',
    'system.bonuses.rangedWeaponAttack'
  ]);

  #updateAttackBonuses(actorData) {
    const {
      meleeWeaponAttack,
      meleeSpellAttack,
      rangedWeaponAttack,
      rangedSpellAttack
    } = actorData.system.bonuses ?? {};

    const bonuses = {};

    if (meleeWeaponAttack) {
      bonuses[foundry.utils.randomID()] = {
        context: {
          attackTypes: ['meleeWeaponAttack']
        },
        formula: meleeWeaponAttack,
        label: 'Melee Weapon Attack',
        default: true
      };
    }

    if (meleeSpellAttack) {
      bonuses[foundry.utils.randomID()] = {
        context: {
          attackTypes: ['meleeSpellAttack']
        },
        formula: meleeSpellAttack,
        label: 'Melee Spell Attack',
        default: true
      };
    }

    if (rangedWeaponAttack) {
      bonuses[foundry.utils.randomID()] = {
        context: {
          attackTypes: ['rangedWeaponAttack']
        },
        formula: rangedWeaponAttack,
        label: 'Ranged Weapon Attack',
        default: true
      };
    }

    if (rangedSpellAttack) {
      bonuses[foundry.utils.randomID()] = {
        context: {
          attackTypes: ['rangedSpellAttack']
        },
        formula: rangedSpellAttack,
        label: 'Ranged Spell Attack',
        default: true
      };
    }

    actorData.system.bonuses.attacks = bonuses;
  }

  #getEffectChange(change, type) {
    const formula = change.value ?? '';

    const bonus = {
      context: {
        attackTypes: [type]
      },
      formula,
      label: A5E.attackTypes[type],
      img: 'icons/svg/upgrade.svg',
      default: true
    };

    const newChange = foundry.utils.deepClone(change);
    newChange.key = 'flags.a5e.effects.bonuses.attacks';
    newChange.value = JSON.stringify(bonus);
    newChange.mode = 0;
    return newChange;
  }

  async updateActor(actorData) {
    this.#updateAttackBonuses(actorData);
  }

  async updateEffect(effectData) {
    const changes = effectData.changes ?? [];
    if (!changes.length) return;

    changes.forEach((change, idx) => {
      const { key } = change;

      if (!this.#effectKeys.has(key)) return;

      if (key === 'system.bonuses.meleeWeaponAttack') {
        const attackChange = this.#getEffectChange(change, 'meleeWeaponAttack');
        changes[idx] = attackChange;
      } else if (key === 'system.bonuses.meleeSpellAttack') {
        const attackChange = this.#getEffectChange(change, 'meleeSpellAttack');
        changes[idx] = attackChange;
      } else if (key === 'system.bonuses.rangedWeaponAttack') {
        const attackChange = this.#getEffectChange(change, 'rangedWeaponAttack');
        changes[idx] = attackChange;
      } else if (key === 'system.bonuses.rangedSpellAttack') {
        const attackChange = this.#getEffectChange(change, 'rangedSpellAttack');
        changes[idx] = attackChange;
      }
    });
  }
}
