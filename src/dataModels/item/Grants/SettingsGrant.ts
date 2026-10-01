import SettingsGrantConfig from '#view/components/grants/SettingsGrantConfig.svelte';
import { BaseGrant } from './BaseGrant.ts';
import { settingsGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
	// Config
	config: new fields.SchemaField({
		settings: new fields.ObjectField({ required: true, nullable: false }),
	}),

	// Applied
	applied: new fields.SchemaField(settingsGrantSchema()),

	// Overrides
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Actor Settings Grant',
	}),
	type: new fields.StringField({
		required: true,
		nullable: false,
		blank: false,
		initial: 'settings',
	}),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace SettingsGrant {
	type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class SettingsGrant extends BaseGrant<SettingsGrant.Schema> {
	#configComponent = SettingsGrantConfig;

	#type = 'settings';

	static override type = 'settings';

	static override defineSchema(): SettingsGrant.Schema {
		// @ts-expect-error
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	override getApplyData(actor: Character): any {
		if (!actor) return {};

		const settings = Object.entries(this.config.settings ?? {});

		const previousSettings = settings.reduce((acc, [id]) => {
			// @ts-expect-error
			const val = actor.getFlag('a5e', id);
			if (val) acc[id] = val;
			else acc[id] = CONFIG.A5E.settingsGrantConfig[id]?.default ?? null;

			return acc;
		}, {});

		const appliedData: typeof this.applied = {
			previous: previousSettings,
			grantType: 'settings',
			level: this.level,
			isApplied: true,
		};

		const updateData: Record<string, any> = {};

		settings.forEach(([id, val]) => {
			updateData[`flags.a5e.${id}`] = val;
		});

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

		super.configureGrant('Configure Settings Grant', dialogData, this.#configComponent, {
			width: 500,
		});
	}
}

export { SettingsGrant };
