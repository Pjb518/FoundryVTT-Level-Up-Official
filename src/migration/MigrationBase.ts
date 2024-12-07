interface MigrationBase {
	updateActor?(source: Record<string, any>): Promise<void>;

	updateItem?(source: Record<string, any>, parent?: any): Promise<void>;

	updateEffect?(source: any, parent?: any): Promise<void>;

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
