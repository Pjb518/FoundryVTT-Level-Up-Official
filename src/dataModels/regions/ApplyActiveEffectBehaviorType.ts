import type { RegionEvent } from './data.ts';

import fields = foundry.data.fields;
import RegionBehaviorType = foundry.data.regionBehaviors.RegionBehaviorType;
import RDoc = foundry.documents.RegionDocument;

// ======================================================
//                      Schema
// ======================================================
const schema = () => ({
	creatureSizes: new fields.SetField(
		new fields.StringField({ choices: () => CONFIG.A5E.actorSizes }),
	),
	creatureTypes: new fields.SetField(
		new fields.StringField({ choices: () => CONFIG.A5E.creatureTypes }),
	),
	dispositions: new fields.SetField(
		new fields.NumberField({
			required: true,
			nullable: false,
			initial: 0,
		}),
	),
	effects: new fields.SetField(
		new fields.DocumentUUIDField({ type: 'ActiveEffect', nullable: false }),
	),
	isAura: new fields.BooleanField({ required: true, nullable: false, initial: false }),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace ApplyActiveEffectBehaviorType {
	type Schema = DataSchema & ReturnType<typeof schema>;
}

// ======================================================
//                      Class
// ======================================================
// @ts-expect-error
class ApplyActiveEffectBehaviorType extends RegionBehaviorType<ApplyActiveEffectBehaviorType.Schema> {
	static override defineSchema(): ApplyActiveEffectBehaviorType.Schema {
		return {
			...schema(),
		};
	}

	#evaluateApplication(token: TokenDocument) {
		if (token.disposition === CONST.TOKEN_DISPOSITIONS.SECRET) return false;

		const actor = token.actor as Creature;
		if (actor.isParty()) return false;

		if (this.dispositions.size && !this.dispositions.has(token.disposition)) return false;
		if (this.creatureSizes.size && !this.creatureSizes.has(actor.system.traits.size)) return false;

		if (this.creatureTypes.size) {
			const types = new Set(actor.system.details.creatureTypes ?? []);
			if (!this.creatureTypes.intersects(types)) return false;
		}

		return true;
	}

	static override events = {
		[CONST.REGION_EVENTS.TOKEN_ENTER]: this.#onTokenEnter,
		[CONST.REGION_EVENTS.TOKEN_EXIT]: this.#onTokenExit,
	};

	static async #onTokenEnter(
		this: ApplyActiveEffectBehaviorType,
		event: RegionEvent<RDoc.TokenEnterExitEventData>,
	): Promise<void> {
		if (!event.user.isSelf) return;
		const { token, movement } = event.data;
		const actor = token.actor;
		if (!actor) return;
		if (!this.#evaluateApplication) return;

		const resumeMovement = movement ? token.pauseMovement() : undefined;
		// @ts-expect-error
		const effects = this.effects ? await Promise.all(this.effects.map(fromUuid)) : [];
		const toCreate = this.#getEffectsToCreate(actor, effects);
		if (toCreate.length) await actor.createEmbeddedDocuments('ActiveEffect', toCreate);

		await resumeMovement?.();
	}

	static async #onTokenExit(
		this: ApplyActiveEffectBehaviorType,
		event: RegionEvent<RDoc.TokenEnterExitEventData>,
	): Promise<void> {
		if (!event.user.isSelf) return;
		const { token, movement } = event.data;
		const actor = token.actor;
		if (!actor) return;

		const toDelete = this.#getEffectsToDelete(actor);
		if (!toDelete.length) return;

		const resumeMovement = movement ? token.pauseMovement() : undefined;
		await actor.deleteEmbeddedDocuments('ActiveEffect', toDelete);
		await resumeMovement?.();
	}

	/** @inheritdoc */
	override _onUpdate(changed, options, userId) {
		super._onUpdate(changed, options, userId);
		if (!this.behavior?.active || !('system' in changed)) return;
		this.#recreateEffectsForAllTokens();
	}

	/**
	 * Recreate the effects of tokens within the region.
	 */
	async #recreateEffectsForAllTokens(): Promise<void> {
		// @ts-expect-error
		const effects = (await Promise.all(this.effects.map(fromUuid))) as ActiveEffect[];
		const operations: any[] = [];

		for (const token of this.region?.tokens ?? []) {
			const actor = token.actor;
			if (!actor) continue;

			const toDelete = this.#getEffectsToDelete(actor);
			if (toDelete.length) {
				operations.push({
					action: 'delete',
					documentName: 'ActiveEffect',
					ids: toDelete,
					parent: actor,
				});
			}

			const toCreate = this.#getEffectsToCreate(actor, effects);
			if (toCreate.length) {
				operations.push({
					action: 'create',
					documentName: 'ActiveEffect',
					data: toCreate,
					parent: actor,
				});
			}
		}

		await foundry.documents.modifyBatch(operations);
	}

	/** Get Active Effects that should be created for the Actor. */
	#getEffectsToCreate(actor: Actor.Implementation, effects: ActiveEffect[]): ActiveEffect[] {
		const toCreate: ActiveEffect[] = [];

		for (const effect of effects) {
			const data = effect.toObject() as unknown as ActiveEffect;
			// @ts-expect-error
			delete data._id;

			if (effect.compendium) {
				data._stats.duplicateSource = null;
				data._stats.compendiumSource = effect.uuid;
			} else {
				data._stats.duplicateSource = effect.uuid;
				data._stats.compendiumSource = null;
			}
			data._stats.exportSource = null;
			data.origin = this.behavior!.uuid;

			toCreate.push(data);
		}

		return toCreate;
	}

	/* ---------------------------------------- */

	/**
	 * Get Active Effects that should be deleted from the Actor.
	 */
	#getEffectsToDelete(actor: Actor.Implementation): string[] {
		return actor.effects.reduce((ids, effect) => {
			if (effect.origin === this.behavior?.uuid) ids.push(effect.id);
			return ids;
		}, [] as string[]);
	}
}

export { ApplyActiveEffectBehaviorType };
