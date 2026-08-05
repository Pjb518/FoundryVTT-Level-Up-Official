import { MigrationBase } from '../MigrationBase.ts';

export class Migration022MigratePrice extends MigrationBase {
	static override version = 0.022;

	#updatePrice(source: any) {
		const original = source.system.price ?? '';
		if (typeof original !== 'string') return;

		const trimmed = original.trim();

		let amount: number = 0;
		let denomination = 'gp';
		let special = '';

		// number + optional space + 2-character denomination
		const match = trimmed.match(/^((?:\d{1,3}(?:,\d{3})+)|\d+)\s*([A-Za-z]{2})$/);

		if (match) {
			amount = Number(match[1].replace(/,/g, ''));
			denomination = match[2];
		} else {
			special = trimmed;
		}

		source.system.price = { value: amount, denomination, special };
	}

	override async updateItem(source: any, parent?: any): Promise<void> {
		this.#updatePrice(source);
	}
}
