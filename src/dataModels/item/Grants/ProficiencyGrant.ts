import BaseGrant from './BaseGrant';

import ProficiencyGrantConfig from '../../../apps/components/grants/ProficiencyGrantConfig.svelte';
import ProficiencyGrantSelection from '../../../apps/components/grants/ProficiencyGrantSelection.svelte';
import prepareProficiencyConfigObject from '../../../utils/prepareProficiencyConfigObject';

export default class ProficiencyGrant extends BaseGrant {
	#component = ProficiencyGrantSelection;

	#configComponent = ProficiencyGrantConfig;

	#type = 'proficiency';

	// Define schema variables
	declare keys: {
		base: string[];
		options: string[];
		total: number;
	};

	declare proficiencyType: 'armor' | 'savingThrow' | 'skill' | 'tradition' | 'tool' | 'weapon';

	declare isExpertise: boolean;

	static override defineSchema() {
		const { fields } = foundry.data;

		return this.mergeSchema(super.defineSchema(), {
			grantType: new fields.StringField({ required: true, initial: 'proficiency' }),
			keys: new fields.SchemaField({
				base: new fields.ArrayField(new fields.StringField({ nullable: false, initial: '' }), {
					required: true,
					initial: [],
				}),
				options: new fields.ArrayField(new fields.StringField({ nullable: false, initial: '' }), {
					required: true,
					initial: [],
				}),
				total: new fields.NumberField({ required: true, initial: 0, integer: true }),
			}),
			proficiencyType: new fields.StringField({ required: false, initial: 'armor' }),
			isExpertise: new fields.BooleanField({ required: false, initial: false }),
			label: new fields.StringField({ required: true, initial: 'New Proficiency Grant' }),
		});
	}

	override getApplyData(actor: any, data: any) {
		if (!actor) return {};
		const selected: string[] = data?.selected ?? this.keys.base ?? [];
		const count: number = this.keys.total;

		const updates: Record<string, any> = {};

		// Construct grant
		const grantData = {
			proficiencyData: {
				keys: selected,
				total: count,
				proficiencyType: this.proficiencyType,
			},
			itemUuid: this.parent.uuid,
			grantId: this._id,
			grantType: this.#type,
			level: this.level,
		};

		updates['system.grants'] = {
			...actor.system.grants,
			[this._id]: grantData,
		};

		// Construct proficiency update
		if (this.proficiencyType === 'savingThrow') {
			selected.forEach((key: string) => {
				updates[`system.abilities.${key}.save.proficient`] = true;
			});
		} else if (this.proficiencyType === 'skill') {
			selected.forEach((key: string) => {
				updates[`system.skills.${key}.proficient`] = this.isExpertise ? 2 : 1;
			});
		} else {
			const configObject = prepareProficiencyConfigObject();
			const { propertyKey } = configObject[this.proficiencyType] ?? {};
			if (!propertyKey) return {};
			if (!selected.length) return {};

			const proficiencies = new Set([
				...selected,
				...((foundry.utils.getProperty(actor, propertyKey) as string[]) ?? []),
			]);

			updates[propertyKey] = [...proficiencies];
		}

		return updates;
	}

	override getSelectionComponent() {
		return this.#component;
	}

	override getSelectionComponentProps(data: any) {
		return {
			base: this.keys.base ?? [],
			choices: this.keys.options,
			count: this.keys.total,
			proficiencyType: this.proficiencyType,
			selected: data?.selected ?? [],
		};
	}

	override requiresConfig(): boolean {
		return !!this.keys.options.length;
	}

	override async configureGrant() {
		const dialogData = {
			document: this.parent,
			grantId: this._id,
		};

		super.configureGrant('Configure Proficiency Grant', dialogData, this.#configComponent, {
			width: 400,
		});
	}
}
