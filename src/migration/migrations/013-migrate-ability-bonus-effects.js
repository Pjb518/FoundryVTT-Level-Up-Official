import MigrationBase from '../MigrationBase';

export default class MigrateAbilityBonusEffects extends MigrationBase {
  static version = 0.013;

  #effectKeys = new Set([
    'system.abilities.str.value',
    'system.abilities.dex.value',
    'system.abilities.con.value',
    'system.abilities.int.value',
    'system.abilities.wis.value',
    'system.abilities.cha.value'
  ]);

  async updateEffect(effectData) {
    const changes = effectData.changes ?? [];
    if (!changes.length) return;

    changes.forEach((change, idx) => {
      const { key } = change;

      if (!this.#effectKeys.has(key)) return;

      const formula = change.value ?? '';
      if (!formula) return;

      const ability = key.split('.').at(-2);
      if (!ability) return;

      const bonus = {
        context: {
          abilities: [ability],
          types: ['base'],
          requiresProficiency: false
        },
        formula,
        label: 'Ability Bonus',
        img: effectData.icon || effectData.img || '',
        default: true
      };

      const newChange = foundry.utils.deepClone(change);
      newChange.key = 'flags.a5e.effects.bonuses.abilities';
      newChange.value = JSON.stringify(bonus);
      newChange.mode = 0;
      changes[idx] = newChange;
    });
  }
}
