import NumericalGrantConfig from '#view/components/grants/CurrencyGrantConfig.svelte';
import { BaseGrant } from './BaseGrant.ts';
import { baseSchema } from './common.ts';

import fields = foundry.data.fields;

import CurrencyGrantConfig from '#view/components/grants/CurrencyGrantConfig.svelte';

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// Config
	config: new fields.SchemaField({
		currency: new fields.SchemaField({
			value: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
			denom: new fields.StringField({ required: true, nullable: false, initial: 'gp' }),
		}),
	}),
	// Applied
	applied: new fields.SchemaField(baseSchema()),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Currency Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'currency',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace CurrencyGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class CurrencyGrant extends BaseGrant<CurrencyGrant.Schema> {
	#configComponent = CurrencyGrantConfig;

	#type = 'currency';

	static override type = 'currency';

	static override defineSchema(): CurrencyGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: Character): any {
		if (!actor) return {};

		const appliedData: typeof this.applied = {
			level: this.level,
			isApplied: true,
		};

		const denom = this.config.currency.denom || 'gp';
		const value = this.config.currency.value || 0;

		const existing = foundry.utils.getProperty(actor, `system.currency.${denom}`) as number;

		const updateData: Record<string, any> = {
			[`system.currency.${denom}`]: existing + value,
		};

		return {
			appliedData: this._getAppliedUpdate(appliedData),
			updateData,
		};
	}

	override getSelectionComponent() {
		return null;
	}

	override getSelectionComponentProps() {
		return null;
	}

	override requiresConfig() {
		return false;
	}

	override async configureGrant() {
		const dialogData = {
			document: this.item,
			grantId: this.id,
			grantType: this.#type,
		};

		super.configureGrant('Configure Currency Grant', dialogData, this.#configComponent, {
			width: 500,
		});
	}
}

export { CurrencyGrant };
