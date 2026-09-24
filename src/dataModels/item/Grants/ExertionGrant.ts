import ExertionGrantConfig from '#view/components/grants/ExertionGrantConfig.svelte';
import { BaseGrant } from './BaseGrant.ts';
import { exertionGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// Config
	config: new fields.SchemaField({
		bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
		exertionType: new fields.StringField({
			required: true,
			nullable: false,
			initial: 'bonus',
			choices: ['bonus', 'pool'],
		}),
		poolType: new fields.StringField({
			required: true,
			nullable: false,
			initial: 'none',
			choices: ['none', 'prof', 'doubleProf'],
		}),
	}),
	// Applied
	applied: new fields.SchemaField(exertionGrantSchema(), { required: true, nullable: false }),

	// Deprecations
	/** @deprecated */
	exertionType: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'bonus',
		choices: ['bonus', 'pool'],
	}),
	/** @deprecated */
	bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
	/** @deprecated */
	poolType: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'none',
		choices: ['none', 'prof', 'doubleProf'],
	}),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Exertion Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'exertion',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace ExertionGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class ExertionGrant extends BaseGrant<ExertionGrant.Schema> {
	#component = null;

	#configComponent = ExertionGrantConfig;

	#type = 'exertion';

	static override type = 'ability';

	static override defineSchema(): ExertionGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: any): any {
		if (!actor) return {};

		const updates: Record<string, any> = {};

		// Construct bonus
		const bonusId = foundry.utils.randomID();

		if (this.exertionType === 'bonus') {
			const bonus = {
				formula: this.bonus,
				label: this.label || this.parent?.name || 'Exertion Grant',
				img: this.img || this?.parent?.img,
			};

			updates[`system.bonuses.exertion.${bonusId}`] = bonus;
		}

		// Construct grant data
		const grantData = {
			itemUuid: this.parent.uuid,
			grantId: this._id,
			exertionData: {
				exertionType: this.exertionType,
				bonusId: this.exertionType === 'bonus' ? bonusId : undefined,
				poolType: this.poolType,
			},
			grantType: this.#type,
			level: this.level,
		};

		updates['system.grants'] = {
			...actor.system.grants,
			[this._id]: grantData,
		};

		return updates;
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

	override async configureGrant(): Promise<any> {
		const dialogData = {
			document: this?.parent,
			grantId: this._id,
			grantType: this.#type,
		};

		super.configureGrant('Configure Exertion Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}
}

export { ExertionGrant };
