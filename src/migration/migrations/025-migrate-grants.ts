import { MigrationBase } from '../MigrationBase.ts';

export class Migration025MigrateGrants extends MigrationBase {
	static override version = 0.025;

	override async updateItem(source: Item, actor?: Character): Promise<void> {
		if (!source.system.grants) return;

		const itemId = source._id!;

		Object.entries(source.system.grants ?? {}).forEach(([grantId, grant]) => {
			// Base migrations
			const newGrant = {
				id: grantId,
				name: grant.label || '',
				img: grant.img || '',
				level: grant.level || 1,
				levelType: grant.levelType || 'character',
				optional: grant.optional || false,
				type: grant.grantType,
			} as typeof grant;

			const actorGrant = this.getActorGrant(itemId, grantId, actor) as
				| Record<string, any>
				| undefined;

			if (actor && actorGrant) {
				// @ts-expect-error
				newGrant.applied ??= {};
				newGrant.applied.isApplied = true;
			}

			if (grant.type === 'ability' && newGrant.type === 'ability') {
				// @ts-expect-error
				newGrant.config ??= {};
				// @ts-expect-error
				newGrant.config.abilities ??= {};
				newGrant.config.abilities.base = grant.abilities?.base ?? [];
				newGrant.config.abilities.options = grant.abilities?.options ?? [];
				newGrant.config.abilities.total ||= grant.abilities?.total || 0;

				newGrant.config.bonus = grant.bonus || '';
				newGrant.config.context = grant.context ?? {};

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					newGrant.applied ??= {};
					newGrant.applied.bonusId ||= (actorGrant.bonusId as string) || '';
					newGrant.applied.bonusType ||= (actorGrant.type as string) || '';
					newGrant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'attack' && newGrant.type === 'attack') {
				// @ts-expect-error
				newGrant.config ??= {};
				// @ts-expect-error
				newGrant.config.attackTypes ??= {};
				newGrant.config.attackTypes.base = grant.attackTypes?.base ?? [];
				newGrant.config.attackTypes.options = grant.attackTypes?.options ?? [];
				newGrant.config.attackTypes.total = grant.attackTypes?.total || 0;

				newGrant.config.bonus = grant.bonus || '';
				newGrant.config.context = grant.context ?? {};

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					newGrant.applied ??= {};
					newGrant.applied.bonusId ||= (actorGrant.bonusId as string) || '';
					newGrant.applied.bonusType ||= (actorGrant.type as string) || '';
					newGrant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'damage' && newGrant.type === 'damage') {
				// @ts-expect-error
				newGrant.config ??= {};
				newGrant.config.damageType = grant.damageType || '';
				newGrant.config.bonus = grant.bonus || '';
				newGrant.config.context = grant.context || {};

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					newGrant.applied ??= {};
					newGrant.applied.bonusId ||= (actorGrant.bonusId as string) || '';
					newGrant.applied.bonusType ||= (actorGrant.type as string) || '';
					newGrant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'exertion' && newGrant.type === 'exertion') {
				// @ts-expect-error
				newGrant.config ??= {};
				newGrant.config.exertionType = grant.exertionType || 'bonus';
				newGrant.config.bonus = grant.bonus || '';
				newGrant.config.poolType = grant.poolType || 'none';

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					newGrant.applied ??= {};
					newGrant.applied.bonusId ||= (actorGrant.bonusId as string) || '';
					newGrant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'expertiseDice' && newGrant.type === 'expertiseDice') {
				// @ts-expect-error
				newGrant.config ??= {};
				newGrant.config.keys = {
					base: grant.keys?.base ?? [],
					options: grant.keys?.options ?? [],
					total: grant.keys?.total || 0,
				};

				newGrant.config.expertiseCount = grant.expertiseCount || 1;
				newGrant.config.expertiseType = grant.expertiseType || 'abilityCheck';

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					newGrant.applied ??= {};
					newGrant.applied.selected = (actorGrant.expertiseDiceData.keys as string[]) ?? [];
					newGrant.applied.expertiseCount = (actorGrant.type as number) || 1;
					newGrant.applied.expertiseType = (actorGrant.type as string) || '';
					newGrant.applied.grantType = 'expertiseDice';
				}
			} else if (grant.type === 'feature' && newGrant.type === 'feature') {
				// @ts-expect-error
				newGrant.config ??= {};
				newGrant.config.features = {
					base:
						grant.features.base?.map((f) => {
							return {
								uuid: f.uuid || '',
								limitedReselection: f.limitedReselection ?? true,
								selectionLimit: f.selectionLimit || 1,
							};
						}) ?? [],
					options:
						grant.features.options?.map((f) => {
							return {
								uuid: f.uuid || '',
								limitedReselection: f.limitedReselection ?? true,
								selectionLimit: f.selectionLimit || 1,
							};
						}) ?? [],
					total: grant.features.total || 0,
				};

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					newGrant.applied ??= {};
					newGrant.applied.documentIds ||= (actorGrant.documentIds ?? []) as Set<string>;
					newGrant.applied.grantType ||= 'document';
				}
			} else if (grant.type === 'healing' && newGrant.type === 'healing') {
				// @ts-expect-error
				newGrant.config ??= {};
				newGrant.config.healingType = grant.healingType || 'healing';
				newGrant.config.bonus = grant.bonus || '';
				newGrant.config.context = grant.context ?? {};

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					newGrant.applied ??= {};
					newGrant.applied.bonusId ||= (actorGrant.bonusId as string) || '';
					newGrant.applied.bonusType ||= (actorGrant.type as string) || 'healing';
					newGrant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'hitPoint' && newGrant.type === 'hitPoint') {
				// @ts-expect-error
				newGrant.config ??= {};
				newGrant.config.bonus = grant.bonus || '';
				newGrant.config.context = grant.context ?? {};

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					newGrant.applied ??= {};
					newGrant.applied.bonusId ||= (actorGrant.bonusId as string) || '';
					newGrant.applied.bonusType ||= (actorGrant.type as string) || '';
					newGrant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'initiative' && newGrant.type === 'initiative') {
				// @ts-expect-error
				newGrant.config ??= {};
				newGrant.config.bonus = grant.bonus || '';
				newGrant.config.context = grant.context ?? {};

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					newGrant.applied ??= {};
					newGrant.applied.bonusId ||= (actorGrant.bonusId as string) || '';
					newGrant.applied.bonusType ||= (actorGrant.type as string) || '';
					newGrant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'item' && newGrant.type === 'item') {
				// @ts-expect-error
				newGrant.config ??= {};
				newGrant.config.items = {
					base:
						grant.items?.base?.map((i) => {
							return {
								uuid: i.uuid || '',
								quantityOverride: i.quantityOverride || 0,
							};
						}) ?? [],
					options:
						grant.items?.options?.map((i) => {
							return {
								uuid: i.uuid || '',
								quantityOverride: i.quantityOverride || 0,
							};
						}) ?? [],
					total: grant.items?.total || 0,
				};

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					newGrant.applied ??= {};
					newGrant.applied.documentIds ||= (actorGrant.documentIds ?? []) as Set<string>;
					newGrant.applied.grantType ||= 'document';
				}
			} else if (grant.type === 'movement' && newGrant.type === 'movement') {
				// @ts-expect-error
				newGrant.config ??= {};
				newGrant.config.movementTypes = {
					base: grant.movementTypes?.base ?? [],
					options: grant.movementTypes?.options ?? [],
					total: grant.movementTypes?.total || 0,
				};

				newGrant.config.bonus = grant.bonus || '';
				newGrant.config.context = grant.context ?? {};
				newGrant.config.unit = grant.unit || 'feet';

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					newGrant.applied ??= {};
					newGrant.applied.bonusId ||= (actorGrant.bonusId as string) || '';
					newGrant.applied.bonusType ||= (actorGrant.type as string) || '';
					newGrant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'proficiency' && newGrant.type === 'proficiency') {
				// @ts-expect-error
				newGrant.config ??= {};

				const profType = grant.proficiencyType || 'armor';
				newGrant.config.keys = {
					base: (grant.keys.base?.map?.((v) => `${profType}:${v}`) ?? []) as unknown as Set<string>,
					options: grant.keys?.options?.length
						? [
								{
									count: grant.keys.total || 1,
									candidates: (grant.keys?.options?.map((v) => `${profType}:${v}`) ??
										[]) as unknown as Set<string>,
								},
							]
						: [],
				};

				newGrant.config.isExpertise = grant.isExpertise || false;

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					newGrant.applied ??= {};

					const profType = actorGrant.proficiencyData.proficiencyType || 'armor';
					newGrant.applied.selected =
						actorGrant.proficiencyData?.keys?.map((v) => `${profType}:${v}`) ?? [];
					newGrant.applied.grantType ||= 'proficiency';
				}
			} else if (grant.type === 'rollOverride' && newGrant.type === 'rollOverride') {
				// @ts-expect-error
				newGrant.config ??= {};
				newGrant.config.keys = {
					base: grant.keys?.base ?? [],
					options: grant.keys?.options ?? [],
					total: grant.keys?.total || 0,
				};

				newGrant.config.rollMode = grant.rollMode || 0;
				newGrant.config.rollOverrideType = grant.rollOverrideType || 'abilityCheck';

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					newGrant.applied ??= {};
					newGrant.applied.selected ||= (actorGrant.rollOverrideData.keys ?? []) as string[];
					newGrant.applied.overrideType ||=
						(actorGrant.rollOverrideData.rollOverrideType as string) || 'abilityCheck';
					newGrant.applied.grantType ||= 'rollOverride';
				}
			} else if (grant.type === 'senses' && newGrant.type === 'senses') {
				// @ts-expect-error
				newGrant.config ??= {};
				newGrant.config.senses = {
					base: grant.senses?.base ?? [],
					options: grant.senses?.options ?? [],
					total: grant.senses?.total || 0,
				};

				newGrant.config.bonus = grant.bonus || '';
				newGrant.config.context = grant.context ?? {};
				newGrant.config.unit = grant.unit || 'feet';

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					newGrant.applied ??= {};
					newGrant.applied.bonusId ||= (actorGrant.bonusId as string) || '';
					newGrant.applied.bonusType ||= (actorGrant.type as string) || '';
					newGrant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'skill' && newGrant.type === 'skill') {
				// @ts-expect-error
				newGrant.config ??= {};
				newGrant.config.skills = {
					base: grant.skills?.base ?? [],
					options: grant.skills?.options ?? [],
					total: grant.skills?.total || 0,
				};

				newGrant.config.bonus = grant.bonus || '';
				newGrant.config.context = grant.context ?? {};

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					newGrant.applied ??= {};
					newGrant.applied.bonusId ||= (actorGrant.bonusId as string) || '';
					newGrant.applied.bonusType ||= (actorGrant.type as string) || '';
					newGrant.applied.grantType ||= 'bonus';
				}
			} else if (grant.type === 'skillSpecialty' && newGrant.type === 'skillSpecialty') {
				// @ts-expect-error
				newGrant.config ??= {};
				newGrant.config.specialties = {
					base: grant.specialties?.base ?? [],
					options: grant.specialties?.options ?? [],
					total: grant.specialties?.total || 0,
				};

				newGrant.config.skill = grant.skill;

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					newGrant.applied ??= {};
					newGrant.applied.selected ||= (actorGrant.specialtyData?.specialties as string[]) ?? [];
					newGrant.applied.skill ||= (actorGrant.specialtyData.skill as string) || '';
					newGrant.applied.grantType ||= 'skillSpecialty';
				}
			} else if (grant.type === 'trait' && newGrant.type === 'trait') {
				// @ts-expect-error
				newGrant.config ??= {};
				newGrant.config.traits = {
					base: grant.traits?.base ?? [],
					options: grant.traits?.options ?? [],
					total: grant.traits?.total || 0,
					traitType: grant.traits?.traitType || 'conditionImmunities',
				};

				// Actor part
				if (actor && actorGrant) {
					// @ts-expect-error
					newGrant.applied ??= {};
					newGrant.applied.selected ||= (actorGrant.traitData?.traits as string[]) ?? [];
					newGrant.applied.traitType ||=
						(actorGrant.specialtyData?.traitType as string) || 'conditionImmunities';
					newGrant.applied.grantType ||= 'trait';
				}
			}

			foundry.utils.setProperty(source.system, `grants.${grantId}`, newGrant);
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
