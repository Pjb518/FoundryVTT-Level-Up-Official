import MigrationBase from '../MigrationBase';

export default class Migration019MigrateFeatureGrant extends MigrationBase {
  static version = 0.019;

  async updateItem(item: Record<string, any>) {
    const grants: Record<string, any> = item.system.grants ?? {};

    Object.entries(grants).forEach(([grantId, grant]) => {
      if (grant.grantType !== 'feature') return;

      // eslint-disable-next-line max-len
      const { base = [], options = [] }: { base: string[], options: string[] } = grant.features ?? {};

      const baseFeatures = base
        .map((uuid) => ({ uuid, limitedReselection: true, selectionLimit: 1 }));

      const optionalFeatures = options
        .map((uuid) => ({ uuid, limitedReselection: true, selectionLimit: 1 }));

      item.system.grants[grantId].features = {
        base: baseFeatures,
        options: optionalFeatures,
        total: grant.features?.total ?? 0
      };
    });
  }
}
