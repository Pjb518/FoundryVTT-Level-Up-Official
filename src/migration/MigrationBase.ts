interface MigrationBase {
	updateActor?(source: Actor): Promise<void>;

	updateItem?(source: Item, parent?: any): Promise<void>;

	updateEffect?(source: ActiveEffect, parent?: any): Promise<void>;

	updateJournalEntry?(source: any): Promise<void>;

	updateMacro?(source: any): Promise<void>;

	updateTable?(source: any): Promise<void>;

	updateToken?(source: any, actor: any, scene: any): Promise<void>;

	updateScene?(source: any): Promise<void>;

	updateUser?(source: any): Promise<void>;

	migrate?(): Promise<void>;
}

abstract class MigrationBase {
	static readonly version: number;

	// @ts-expect-error
	readonly version: number = this.constructor.version;

	requiresFlush = false;
}

export { MigrationBase };
