import { MigrationBase } from '../MigrationBase.ts';

export class Migration025MigrateGrants extends MigrationBase {
	static override version = 0.025;

	override async updateItem(source: Item, actor?: Character): Promise<void> {
		if (!source.system.grants) return;

		const itemId = source._id!;

		Object.entries(source.system.grants ?? {}).forEach(([grantId, grant]) => {
			// Base migrations
			grant.id = grantId;
			grant.name = grant.label;
			// @ts-expect-error
			grant.type = grant.grantType;

			if (actor) {
				// @ts-expect-error
				grant.applied ??= {};
				grant.applied.isApplied = true;
			}

			const actorGrant = this.getActorGrant(itemId, grantId, actor) as
				| Record<string, any>
				| undefined;

			if (grant.type === 'ability') {
				// @ts-expect-error
				grant.config ??= {};
				if (!grant.config.abilities) grant.config.abilities = grant.abilities;
				if (!grant.config.bonus) grant.config.bonus = grant.bonus;
				if (!grant.config.context) grant.config.context = grant.context;

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					grant.applied ??= {};
					grant.applied.bonusId ||= actorGrant.bonusId as string;
					grant.applied.bonusType ||= actorGrant.type as string;
					grant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'attack') {
				// @ts-expect-error
				grant.config ??= {};
				if (!grant.config.attackTypes) grant.config.attackTypes = grant.attackTypes;
				if (!grant.config.bonus) grant.config.bonus = grant.bonus;
				if (!grant.config.context) grant.config.context = grant.context;

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					grant.applied ??= {};
					grant.applied.bonusId ||= actorGrant.bonusId as string;
					grant.applied.bonusType ||= actorGrant.type as string;
					grant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'damage') {
				// @ts-expect-error
				grant.config ??= {};
				if (!grant.config.damageType) grant.config.damageType = grant.damageType;
				if (!grant.config.bonus) grant.config.bonus = grant.bonus;
				if (!grant.config.context) grant.config.context = grant.context;

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					grant.applied ??= {};
					grant.applied.bonusId ||= actorGrant.bonusId as string;
					grant.applied.bonusType ||= actorGrant.type as string;
					grant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'exertion') {
				// @ts-expect-error
				grant.config ??= {};
				if (!grant.config.exertionType) grant.config.exertionType = grant.exertionType;
				if (!grant.config.bonus) grant.config.bonus = grant.bonus;
				if (!grant.config.poolType) grant.config.poolType = grant.poolType;

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					grant.applied ??= {};
					grant.applied.bonusId ||= actorGrant.bonusId as string;
					grant.applied.bonusType ||= actorGrant.type as string;
					grant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'expertiseDice') {
				// @ts-expect-error
				grant.config ??= {};
				if (!grant.config.keys) grant.config.keys = grant.keys;
				if (!grant.config.expertiseCount) grant.config.expertiseCount = grant.expertiseCount;
				if (!grant.config.expertiseType) grant.config.expertiseType = grant.expertiseType;

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					grant.applied ??= {};
					grant.applied.selected ||= actorGrant.expertiseDiceData.keys as string[];
					grant.applied.bonusType ||= actorGrant.type as string;
					grant.applied.grantType ||= 'expertiseDice';
				}
			} else if (grant.type === 'feature') {
				// @ts-expect-error
				grant.config ??= {};
				if (!grant.config.features) grant.config.features = grant.features;

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					grant.applied ??= {};
					grant.applied.documentIds ||= actorGrant.documentIds as Set<string>;
					grant.applied.grantType ||= 'document';
				}
			} else if (grant.type === 'healing') {
				// @ts-expect-error
				grant.config ??= {};
				if (!grant.config.healingType) grant.config.healingType = grant.healingType;
				if (!grant.config.bonus) grant.config.bonus = grant.bonus;
				if (!grant.config.context) grant.config.context = grant.context;

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					grant.applied ??= {};
					grant.applied.bonusId ||= actorGrant.bonusId as string;
					grant.applied.bonusType ||= actorGrant.type as string;
					grant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'hitPoint') {
				// @ts-expect-error
				grant.config ??= {};
				if (!grant.config.bonus) grant.config.bonus = grant.bonus;
				if (!grant.config.context) grant.config.context = grant.context;

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					grant.applied ??= {};
					grant.applied.bonusId ||= actorGrant.bonusId as string;
					grant.applied.bonusType ||= actorGrant.type as string;
					grant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'initiative') {
				// @ts-expect-error
				grant.config ??= {};
				if (!grant.config.bonus) grant.config.bonus = grant.bonus;
				if (!grant.config.context) grant.config.context = grant.context;

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					grant.applied ??= {};
					grant.applied.bonusId ||= actorGrant.bonusId as string;
					grant.applied.bonusType ||= actorGrant.type as string;
					grant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'item') {
				// @ts-expect-error
				grant.config ??= {};
				if (!grant.config.items) grant.config.items = grant.items;

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					grant.applied ??= {};
					grant.applied.documentIds ||= actorGrant.documentIds as Set<string>;
					grant.applied.grantType ||= 'document';
				}
			} else if (grant.type === 'movement') {
				// @ts-expect-error
				grant.config ??= {};
				if (!grant.config.movementTypes) grant.config.movementTypes = grant.movementTypes;
				if (!grant.config.bonus) grant.config.bonus = grant.bonus;
				if (!grant.config.context) grant.config.context = grant.context;
				if (!grant.config.unit) grant.config.unit = grant.unit;

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					grant.applied ??= {};
					grant.applied.bonusId ||= actorGrant.bonusId as string;
					grant.applied.bonusType ||= actorGrant.type as string;
					grant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'proficiency') {
				// @ts-expect-error
				grant.config ??= {};
				if (!grant.config.keys) {
					// @ts-expect-error
					grant.config.keys.base = grant.keys.base?.map?.((v) => `${grant.proficiencyType}:${v}`);
					if (grant.keys.options.length) {
						// @ts-expect-error
						grant.config.keys.options = [
							{
								count: grant.keys.total,
								candidates: grant.keys.options.map((v) => `${grant.proficiencyType}${v}}`),
							},
						];
					}
				}
				if (!grant.config.isExpertise) grant.config.isExpertise = grant.isExpertise;

				// Actor part
			} else if (grant.type === 'rollOverride') {
				// @ts-expect-error
				grant.config ??= {};
				if (!grant.config.keys) grant.config.keys = grant.keys;
				if (!grant.config.rollMode) grant.config.rollMode = grant.rollMode;
				if (!grant.config.rollOverrideType) grant.config.rollOverrideType = grant.rollOverrideType;
				//
				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					grant.applied ??= {};
					grant.applied.selected ||= actorGrant.rollOverrideData.keys as string[];
					grant.applied.overrideType ||= actorGrant.rollOverrideData.rollOverrideTypetype as string;
					grant.applied.grantType ||= 'rollOverride';
				}
			} else if (grant.type === 'senses') {
				// @ts-expect-error
				grant.config ??= {};
				if (!grant.config.senses) grant.config.senses = grant.senses;
				if (!grant.config.bonus) grant.config.bonus = grant.bonus;
				if (!grant.config.context) grant.config.context = grant.context;
				if (!grant.config.unit) grant.config.unit = grant.unit;

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					grant.applied ??= {};
					grant.applied.bonusId ||= actorGrant.bonusId as string;
					grant.applied.bonusType ||= actorGrant.type as string;
					grant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'skill') {
				// @ts-expect-error
				grant.config ??= {};
				if (!grant.config.skills) grant.config.skills = grant.skills;
				if (!grant.config.bonus) grant.config.bonus = grant.bonus;
				if (!grant.config.context) grant.config.context = grant.context;

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					grant.applied ??= {};
					grant.applied.bonusId ||= actorGrant.bonusId as string;
					grant.applied.bonusType ||= actorGrant.type as string;
					grant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'skillSpecialty') {
				// @ts-expect-error
				grant.config ??= {};
				if (!grant.config.specialties) grant.config.specialties = grant.specialties;
				if (!grant.config.skill) grant.config.skill = grant.skill;

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					grant.applied ??= {};
					grant.applied.selected ||= actorGrant.specialtyData.specialties as string[];
					grant.applied.skill ||= actorGrant.specialtyData.skill as string;
					grant.applied.grantType ||= 'skillSpecialty';
				}
			} else if (grant.type === 'trait') {
				// @ts-expect-error
				grant.config ??= {};
				if (!grant.config.traits) grant.config.traits = grant.traits;

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					grant.applied ??= {};
					grant.applied.selected ||= actorGrant.traitData.traits as string[];
					grant.applied.traitType ||= actorGrant.specialtyData.traitType as string;
					grant.applied.grantType ||= 'trait';
				}
			}

			foundry.utils.setProperty(source.system, `grants.${grantId}`, grant);
		});
	}

	getActorGrant(itemId: string, grantId: string, actor?: Character) {
		if (!actor) return undefined;

		const grants = Object.entries(actor.system.grants ?? {});
		return grants.find(
			([id, grant]) =>
				id === grantId && ((grant.itemUuid as string) ?? '').split('.').at(-1) === itemId,
		)?.[1];
	}
}
