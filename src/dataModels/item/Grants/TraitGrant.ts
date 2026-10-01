import prepareTraitGrantConfigObject from '#utils/prepareTraitGrantConfigObject.ts';
import TraitGrantConfig from '#view/components/grants/TraitGrantConfig.svelte';
import TraitGrantSelectionDialog from '#view/components/grants/TraitGrantSelectionDialog.svelte';
import { BaseGrant } from './BaseGrant.ts';
import { traitGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// Config
	config: new fields.SchemaField({
		traits: new fields.SchemaField({
			base: new fields.ArrayField(
				new fields.StringField({ required: true, nullable: false, initial: '' }),
				{ required: true, nullable: false },
			),
			options: new fields.ArrayField(
				new fields.StringField({ required: true, nullable: false, initial: '' }),
				{ required: true, initial: [] },
			),
			total: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
			traitType: new fields.StringField({
				required: true,
				nullable: false,
				initial: 'conditionImmunities',
			}),
		}),
		upgradeResist: new fields.BooleanField({ required: true, nullable: false, initial: false }),
	}),

	// Applied
	applied: new fields.SchemaField(traitGrantSchema(), { required: true, nullable: false }),

	// Deprecations
	/** @deprecated */
	traits: new fields.SchemaField({
		/** @deprecated */
		base: new fields.ArrayField(
			new fields.StringField({ required: true, nullable: false, initial: '' }),
			{ required: true, nullable: false },
		),
		/** @deprecated */
		options: new fields.ArrayField(
			new fields.StringField({ required: true, nullable: false, initial: '' }),
			{ required: true, initial: [] },
		),
		/** @deprecated */
		total: new fields.NumberField({ required: true, nullable: false, initial: 0 }),

		/** @deprecated */
		traitType: new fields.StringField({
			required: true,
			nullable: false,
			initial: 'conditionImmunities',
		}),
	}),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Trait Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'trait',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace TraitGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class TraitGrant extends BaseGrant<TraitGrant.Schema> {
	#component = TraitGrantSelectionDialog;

	#configComponent = TraitGrantConfig;

	#type = 'trait';

	static override type = 'trait';

	static override defineSchema(): TraitGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: Character, data: any) {
		if (!actor) return {};
		const selected: string[] = data?.selected ?? this.config.traits.base ?? [];
		const count: number = this.config.traits.total;

		// Construct applied data
		const appliedData: typeof this.applied = {
			selected,
			total: count,
			traitType: this.config.traits.traitType,
			upgraded: [],
			grantType: this.#type,
			level: this.level,
			isApplied: true,
		};

		// Construct trait update
		const configObject = prepareTraitGrantConfigObject();
		const { propertyKey } = configObject[this.config.traits.traitType] ?? {};
		if (!propertyKey) return {};
		if (!selected.length) return {};

		const updates: Record<string, any> = {};

		if (this.config.traits.traitType === 'size') {
			updates[propertyKey] = [...new Set([selected[0]])];
		} else if (this.config.traits.traitType === 'damageResistances') {
			const resistances = new Set(
				(foundry.utils.getProperty(actor, propertyKey) ?? []) as string[],
			);
			const toAdd = new Set(selected);

			if (this.config.upgradeResist) {
				const immunities = new Set(
					(foundry.utils.getProperty(actor, 'system.traits.damageImmunities') ?? []) as string[],
				);
				const upgraded = new Set<string>();

				selected.forEach((val) => {
					if (!resistances.has(val)) return;

					upgraded.add(val);
					toAdd.delete(val);
				});

				appliedData.upgraded = [...upgraded];
				updates['system.traits.damageImmunities'] = [...upgraded, ...immunities];
			}

			updates[propertyKey] = new Set([...toAdd, ...resistances]);
		} else {
			updates[propertyKey] = new Set([
				...selected,
				...((foundry.utils.getProperty(actor, propertyKey) as string[]) ?? []),
			]);
		}

		return {
			appliedData: this._getAppliedUpdate(appliedData),
			updateData: updates,
		};
	}

	override getSelectionComponent() {
		return this.#component;
	}

	override getSelectionComponentProps(data: any) {
		return {
			base: this.config.traits.base ?? [],
			choices: this.config.traits.options,
			count: this.config.traits.total,
			traitType: this.config.traits.traitType,
			selected: data?.selected ?? [],
		};
	}

	override requiresConfig(): boolean {
		return !!this.config.traits.options.length;
	}

	override async configureGrant() {
		const dialogData = {
			document: this.item,
			grantId: this.id,
		};

		super.configureGrant('Configure Trait Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}
}

export { TraitGrant };
