import { MigrationBase } from '../MigrationBase.ts';

export class Migration026MigrateGrants extends MigrationBase {
	static override version = 0.26;

	override async updateItem(source: Item, actor?: Character): Promise<void> {
		if (!source.system.grants) return;

		const itemId = source._id!;

		Object.entries(source.system.grants ?? {}).forEach(([grantId, grant]) => {
			const actorGrant = this.getActorGrant(itemId, grantId, actor);

			if (grant.type === 'exertion' && actorGrant) {
				// @ts-expect-error
				grant.applied ??= {};

				grant.applied.isApplied = true;
				grant.applied.grantType = 'exertion';
				grant.applied.bonusId = (actorGrant.exertionData.bonusId as string) || '';
				grant.applied.exertionType = actorGrant.exertionData.exertionType as string;

				foundry.utils.setProperty(source.system, `grants.${grantId}.applied`, grant.applied);
			}
		});
	}

	getActorGrant(
		itemId: string,
		grantId: string,
		actor?: Character,
	): Record<string, any> | undefined {
		if (!actor) return undefined;

		const grants = Object.entries(actor.system.grants ?? {});
		return grants.find(
			([id, grant]) =>
				id === grantId && ((grant.itemUuid as string) ?? '').split('.').at(-1) === itemId,
		)?.[1];
	}
}
