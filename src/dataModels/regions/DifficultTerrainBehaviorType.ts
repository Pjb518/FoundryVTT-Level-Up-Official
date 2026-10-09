import fields = foundry.data.fields;
import RegionBehaviorType = foundry.data.regionBehaviors.RegionBehaviorType;

// ======================================================
//                      Schema
// ======================================================
const schema = () => ({
	isMagical: new fields.BooleanField({ required: true, nullable: false, initial: false }),
	ignoredDispositions: new fields.SetField(
		new fields.NumberField({
			required: true,
			nullable: false,
			initial: 0,
		}),
	),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace DifficultTerrainBehaviorType {
	type Schema = DataSchema & ReturnType<typeof schema>;
}

// ======================================================
//                      Class
// ======================================================
class DifficultTerrainBehaviorType extends RegionBehaviorType<DifficultTerrainBehaviorType.Schema> {
	static override defineSchema(): DifficultTerrainBehaviorType.Schema {
		return {
			...schema(),
		};
	}

	static override events = {
		[CONST.REGION_EVENTS.BEHAVIOR_VIEWED]: this.#onBehaviorViewed,
		[CONST.REGION_EVENTS.BEHAVIOR_UNVIEWED]: this.#onBehaviorUnviewed,
		[CONST.REGION_EVENTS.REGION_BOUNDARY]: this.#onRegionBoundary,
	};

	static async #onBehaviorViewed(event) {
		canvas.tokens.recalculatePlannedMovementPaths();
	}

	static async #onBehaviorUnviewed(event) {
		canvas.tokens.recalculatePlannedMovementPaths();
	}

	static async #onRegionBoundary(event) {
		canvas.tokens.recalculatePlannedMovementPaths();
	}

	/** @inheritdoc */
	_getTerrainEffects(token, segment) {
		console.log('Here');
	}

	/** @inheritdoc */
	override _onUpdate(changed, options, userId) {
		super._onUpdate(changed, options, userId);

		if ('system' in changed && !this.behavior?.viewed) return;
		canvas.tokens.recalculatePlannedMovementPaths();
	}
}

export { DifficultTerrainBehaviorType };
