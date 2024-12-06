import { MigrationBase } from '../MigrationBase';

export class Migration005MigrateAC extends MigrationBase {
	/** @override */
	static version = 0.005;

	/**
	 * @override
	 * @param {Object} actorData
	 * @returns {Promise<void>}
	 */
	async updateActor(actorData) {
		const { ac } = actorData.system.attributes;

		foundry.utils.setProperty(actorData, 'system.attributes.ac', {
			base: Number.parseInt(ac, 10) || 10,
			value: 0,
		});
	}
}
