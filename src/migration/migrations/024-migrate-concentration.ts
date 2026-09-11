import { MigrationBase } from '../MigrationBase.ts';

export class Migration024MigrateConcentration extends MigrationBase {
	static override version = 0.024;

	override async updateItem(source: Item): Promise<void> {
		if (!['feature', 'maneuver', 'spell'].includes(source.type)) return;

		const hasConcentration = source.system.concentration;
		if (!hasConcentration) return;

		const actions = Object.keys(source.system.actions ?? {});
		if (actions.length !== 1) return;

		const actionId = actions.at(0);
		if (!actionId) return;

		foundry.utils.setProperty(source.system, `actions.${actionId}.duration.concentration`, true);
	}
}
