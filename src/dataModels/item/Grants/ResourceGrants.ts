import ResourceGrantConfig from '#view/components/grants/ResourceGrantConfig.svelte';
import { BaseGrant } from './BaseGrant.ts';
import { resourceGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
//                       Schema
// ======================================================
const DEFAULT_OPTS = { required: true, nullable: false };
const PER_OPTS = {
	...DEFAULT_OPTS,
	initial: 'longRest',
	choices: () => CONFIG.A5E.resourceRecoveryOptions,
};
const TYPE_OPTS = { ...DEFAULT_OPTS, blank: false };

const configSchema = () => ({
	counter: {
		slug: new fields.StringField({ ...DEFAULT_OPTS, initial: '' }),
		reference: new fields.ArrayField(
			new fields.SchemaField({
				level: new fields.NumberField({ ...DEFAULT_OPTS, initial: 1 }),
				per: new fields.StringField({ ...PER_OPTS }),
			}),
			{ ...DEFAULT_OPTS, initial: () => [{ level: 1 }] },
		),
		type: new fields.StringField({ ...TYPE_OPTS, initial: 'counter' }),
	},
	dice: {
		slug: new fields.StringField({ ...DEFAULT_OPTS, initial: '' }),
		consumeType: new fields.StringField({
			required: true,
			nullable: false,
			initial: 'none',
			choices: () => CONFIG.A5E.diceResourceConsumeType,
		}),
		useType: new fields.StringField({
			required: true,
			nullable: false,
			initial: 'decrement',
			choices: () => CONFIG.A5E.diceResourceUseType,
		}),
		reference: new fields.ArrayField(
			new fields.SchemaField({
				size: new fields.NumberField({ ...DEFAULT_OPTS, initial: 1 }),
				denom: new fields.NumberField({ ...DEFAULT_OPTS, initial: 4 }),
				modifiers: new fields.SetField(new fields.StringField({ ...DEFAULT_OPTS, initial: '' }), {
					...DEFAULT_OPTS,
				}),
				max: new fields.StringField({ ...DEFAULT_OPTS, initial: '' }),
				level: new fields.NumberField({ ...DEFAULT_OPTS, initial: 1 }),
				per: new fields.StringField({ ...PER_OPTS }),
			}),
			{ ...DEFAULT_OPTS, initial: () => [{ level: 1 }] },
		),
		type: new fields.StringField({ ...TYPE_OPTS, initial: 'dice' }),
	},
	uses: {
		slug: new fields.StringField({ ...DEFAULT_OPTS, initial: '' }),
		reference: new fields.ArrayField(
			new fields.SchemaField({
				max: new fields.StringField({ ...DEFAULT_OPTS, initial: '' }),
				level: new fields.NumberField({ ...DEFAULT_OPTS, initial: 1 }),
				per: new fields.StringField({ ...PER_OPTS }),
			}),
			{ ...DEFAULT_OPTS, initial: () => [{ level: 1 }] },
		),
		type: new fields.StringField({ ...TYPE_OPTS, initial: 'uses' }),
	},
});

const schema = () => ({
	config: new fields.TypedSchemaField(configSchema()),
	applied: new fields.SchemaField(resourceGrantSchema(), { required: true, nullable: false }),

	// Overrides
	name: new fields.StringField({ required: true, nullable: false, initial: 'New Resource Grant' }),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'resource',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================

declare namespace ResourceGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class ResourceGrant extends BaseGrant<ResourceGrant.Schema> {
	#configComponent = ResourceGrantConfig;

	#type = 'resource';

	static override type = 'resource';

	static override defineSchema(): ResourceGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: Character, data: any): any {
		const appliedData: typeof this.applied = {
			grantType: 'resource',
			slug: this.config.slug || this.name.slugify({ strict: true }),
			isApplied: true,
			level: 1,
		};

		const updateData = {
			[`system.resources.${appliedData.slug}`]: {
				name: this.name,
				type: this.config.type,
			},
		};

		return { appliedData: this._getAppliedUpdate(appliedData), updateData };
	}

	override getSelectionComponent() {
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

		super.configureGrant('Configure Resource Grant', dialogData, this.#configComponent, {
			width: 600,
		});
	}
}

export { ResourceGrant };
