import { MigrationBase } from '../MigrationBase.ts';

export class Migration23MigrateRoll extends MigrationBase {
	static override version = 0.023;

	override async updateEffect(source: ActiveEffect, parent?: any): Promise<void> {
		source.system.changes;
	}
}
