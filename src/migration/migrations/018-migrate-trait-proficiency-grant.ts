/* eslint-disable no-param-reassign */
import { MigrationBase } from '../MigrationBase';

export class Migration018MigrateTraitProficiencyGrant extends MigrationBase {
	static version = 0.018;

	traitTypes = ['armorTypes', 'maneuverTraditions', 'tools', 'weapons'];

	async updateActor(actor: Record<string, any>) {
		const grants: Record<string, any> = actor.system.grants ?? {};

		Object.entries(grants).forEach(([grantId, grant]) => {
			if (!['proficiency', 'trait'].includes(grant.grantType)) return;

			// Change ability to savingThrow
			if (
				grant.grantType === 'proficiency' &&
				grant.proficiencyData.proficiencyType === 'ability'
			) {
				foundry.utils.setProperty(
					actor,
					`system.grants.${grantId}.proficiencyData.proficiencyType`,
					'savingThrow',
				);
			}

			if (grant.grantType !== 'trait') return;

			// Convert armor, skill, tradition, tool, and weapon to proficiency grants
			const { traits, traitType } = grant.traitData;
			if (!this.traitTypes.includes(traitType)) return;

			let proficiencyType: string;
			if (traitType === 'armorTypes') proficiencyType = 'armor';
			else if (traitType === 'maneuverTraditions') proficiencyType = 'tradition';
			else if (traitType === 'tools') proficiencyType = 'tool';
			else if (traitType === 'weapons') proficiencyType = 'weapon';
			else proficiencyType = traitType;

			const proficiencyGrant = {
				grantType: 'proficiency',
				proficiencyData: {
					keys: traits,
					total: traits.length,
					proficiencyType,
				},
			};

			foundry.utils.setProperty(actor, `system.grants.${grantId}`, proficiencyGrant);
		});
	}

	async updateItem(item: Record<string, any>) {
		const grants: Record<string, any> = item.system.grants ?? {};

		Object.entries(grants).forEach(([grantId, grant]) => {
			if (!['proficiency', 'trait'].includes(grant.grantType)) return;

			// Change ability to savingThrow
			if (grant.grantType === 'proficiency' && grant.proficiencyType === 'ability') {
				foundry.utils.setProperty(item, `system.grants.${grantId}.proficiencyType`, 'savingThrow');
			}

			if (grant.grantType !== 'trait') return;

			// Convert armor, skill, tradition, tool, and weapon to proficiency grants
			const { traits } = grant;
			const { traitType } = traits;
			if (!this.traitTypes.includes(traitType)) return;

			let proficiencyType: string;
			if (traitType === 'armorTypes') proficiencyType = 'armor';
			else if (traitType === 'maneuverTraditions') proficiencyType = 'tradition';
			else if (traitType === 'tools') proficiencyType = 'tool';
			else if (traitType === 'weapons') proficiencyType = 'weapon';
			else proficiencyType = traitType;

			const proficiencyGrant = {
				grantType: 'proficiency',
				keys: {
					base: traits.base,
					options: traits.options,
					total: traits.total,
				},
				proficiencyType,
			};

			foundry.utils.setProperty(item, `system.grants.${grantId}`, proficiencyGrant);
		});
	}
}
