import { MigrationBase } from '../MigrationBase.ts';

export class Migration027MigrateResources extends MigrationBase {
	static override version = 0.027;

	override async updateActor(source: Actor): Promise<void> {}

	override async updateItem(source: Item, parent?: any): Promise<void> {}
}
