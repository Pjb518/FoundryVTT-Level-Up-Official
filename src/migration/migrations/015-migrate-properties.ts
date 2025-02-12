import { MigrationBase } from '../MigrationBase';

export class Migration015MigrateProperties extends MigrationBase {
	static version = 0.015;

	async updateItem(item: Record<string, any>) {
		if (item.type !== 'object') return;

		const weaponProperties = item.system.weaponProperties ?? [];

		// Update defensive properties
		if (weaponProperties.includes('defensiveHeavy')) {
			foundry.utils.setProperty(item, 'system.defensiveProperties', 'heavy');
		} else if (weaponProperties.includes('defensiveMedium')) {
			foundry.utils.setProperty(item, 'system.defensiveProperties', 'medium');
		} else if (weaponProperties.includes('defensiveLight')) {
			foundry.utils.setProperty(item, 'system.defensiveProperties', 'light');
		}

		// Update breaker properties
		const breakerProperties: string[] = [];
		if (weaponProperties.includes('breakerStone')) breakerProperties.push('stone');
		if (weaponProperties.includes('breakerWood')) breakerProperties.push('wood');

		item.system.breakerProperties = breakerProperties;
	}
}
