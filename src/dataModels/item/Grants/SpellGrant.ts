import SpellGrantConfig from '#view/components/grants/SpellGrantConfig.svelte';
import SpellGrantSelectionDialog from '#view/components/grants/SpellGrantSelectionDialog.svelte';
import { BaseGrant } from './BaseGrant.ts';
import { documentGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	config: new fields.SchemaField({
		spells: new fields.SchemaField({
			base: new fields.ArrayField(
				new fields.StringField({ required: true, nullable: false, intiial: '' }),
			),
			options: new fields.ArrayField(
				new fields.StringField({ required: true, nullable: false, intiial: '' }),
			),
			total: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
		}),
		alwaysPrepared: new fields.BooleanField({ required: true, nullable: false, initial: false }),
		changes: new fields.JSONField({ required: true, nullable: true, initial: null }),
		consumerData: new fields.SchemaField({
			type: new fields.StringField({
				required: true,
				nullable: false,
				initial: 'spell',
				choices: { actionUses: 'Action Uses', itemUses: 'Item Uses', spell: 'Spell' },
			}),
			recover: new fields.StringField({ required: true, nullable: false, initial: '' }),
			value: new fields.StringField({
				required: true,
				nullable: false,
				intitial: 'longRest',
			}),
		}),
	}),

	applied: new fields.SchemaField(documentGrantSchema(), { required: true, nullable: false }),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Spell Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'spell',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace SpellGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class SpellGrant extends BaseGrant<SpellGrant.Schema> {
	#component = SpellGrantSelectionDialog;

	#configComponent = SpellGrantConfig;

	#type = 'spell';

	static override type = 'spell';

	static override defineSchema(): SpellGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: Character, data: any): any {
		if (!actor) return {};

		return {};
	}

	override getSelectionComponent() {
		return this.#component;
	}

	override getSelectionComponentProps(data: any) {
		return {
			base: this.config.spells.base.map(({ uuid }) => uuid) ?? [],
			choices: this.config.spells.options.map(({ uuid }) => uuid) ?? [],
			count: this.config.spells.total,
			selected: data?.uuids ?? [],
		};
	}

	override requiresConfig() {
		return !!this.config.spells.options.length;
	}

	override async configureGrant() {
		const dialogData = {
			document: this.item,
			grantId: this.id,
			grantType: this.#type,
		};

		super.configureGrant('Configure Spell Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}
}

export { SpellGrant };
