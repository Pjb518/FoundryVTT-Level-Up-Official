import MigrationBase from '../MigrationBase';

export default class Migration016MigrateSkillProficiency extends MigrationBase {
  static version = 0.016;

  async updateEffect(effectData: Record<string, any>) {
    const changes = effectData.changes ?? [];
    if (!changes.length) return;

    changes.forEach((change: Record<string, any>, idx: number) => {
      const { key, value } = change;

      if (key.startsWith('system.skills') && key.endsWith('.proficient')) {
        const newChange = foundry.utils.deepClone(change);
        newChange.value = value === 'true' ? 1 : 0;
        changes[idx] = newChange;
      }
    });
  }
}
