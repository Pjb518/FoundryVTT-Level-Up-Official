import ActiveEffectA5e from './activeEffect/activeEffect';

/**
 * Extend the base TokenDocument class to implement system-specific HP bar logic.
 * @extends {TokenDocument}
 */
export default class TokenDocumentA5e extends TokenDocument {
	overrides = this.overrides ?? {};

	automateVision;

	charOnlyVisionAutomation;

	get scene() {
		return this.parent;
	}

	prepareBaseData() {
		// this.updateTokenSize();
		super.prepareBaseData();

		this.applyActiveEffects();
	}

	applyActiveEffects() {
		this.overrides = {};
		if (!this.actor) return;

		ActiveEffectA5e.applyEffects(
			this,
			this.actor.effects?.contents ?? [],
			'afterDerived',
			null,
			(change) => change.key.startsWith('@token'),
		);
	}

	_prepareDetectionModes() {
		this.automateVision ??=
			game.settings.storage.get('world').getItem('a5e.automateVisionRules') ?? false;
		this.charOnlyVisionAutomation ??=
			game.settings.storage.get('world').getItem('a5e.visionRulesApplyToCharactersOnly') ?? true;

		const { actor, scene } = this;
		if (!this.automateVision || !scene || !actor) {
			super._prepareDetectionModes();
			return;
		}

		if (actor.type === 'npc' && this.charOnlyVisionAutomation) {
			super._prepareDetectionModes();
			return;
		}

		// Enable actor vision if setting checked
		this.sight.enabled = true;
		const lightPerception = { id: 'lightPerception', enabled: true, range: null };
		const basicSight = { id: 'basicSight', enabled: true, range: 0 };
		this.detectionModes = [lightPerception, basicSight];

		this.sight.attenuation = 0.1;
		this.sight.brightness = 0;
		this.sight.contrast = 0;
		this.sight.range = 0;
		this.sight.saturation = 0;

		const { visionData } = actor;
		const currentMode = visionData.hasDarkvision ? 'darkvision' : 'basic';
		this.sight.visionMode = currentMode;
		const { defaults } = CONFIG.Canvas.visionModes[currentMode].vision;

		this.sight.visionMode = currentMode;
		this.sight.brightness = defaults.brightness ?? 0;
		this.sight.saturation = defaults.saturation ?? 0;

		if (currentMode === 'darkvision') {
			this.sight.range = visionData.senses.darkvision.distance;
			basicSight.range = visionData.senses.darkvision.distance;
			this.sight.saturation = -1;
		}

		if (visionData.hasBlindsight) {
			this.detectionModes.push({
				id: 'blindsight',
				enabled: true,
				range: visionData.senses.blindsight.distance ?? 0,
			});
		}

		if (visionData.hasTremorsense) {
			this.detectionModes.push({
				id: 'feelTremor',
				enabled: true,
				range: visionData.senses.tremorsense.distance ?? 0,
			});
		}

		if (visionData.hasTruesight) {
			this.detectionModes.push({
				id: 'seeInvisibility',
				enabled: true,
				range: visionData.senses.truesight.distance ?? 0,
			});
		}
	}

	updateTokenSize() {
		const { actor } = this;
		if (!actor) return;

		const { size } = actor.system.traits;
		const numericalSize = CONFIG.A5E.tokenDimensions[size];
		this.width = numericalSize ?? this.width ?? 1;
		this.height = numericalSize ?? this.height ?? 1;
	}

	/**
	 * Overrides base functionality and doesn't update unlinked tokens.
	 * @override
	 * */
	_onUpdateBaseActor(update = {}, options = {}) {
		// Update synthetic Actor data
		if (!this.isLinked && this.delta) {
			this.delta.updateSyntheticActor();
			// eslint-disable-next-line no-restricted-syntax
			for (const collection of Object.values(this.delta.collections)) {
				collection.initialize({ full: true });
			}
		}

		this._onRelatedUpdate(update, options);
		this._updateCanvas(update);
	}

	// Update canvas if there are changes that affect the canvas
	_updateCanvas(updates) {
		if (!this.scene?.isInFocus && !this.scene?.isView) return;
		if (!this.automateVision || !this.sight.enabled) return;

		const keys = Object.keys(foundry.utils.flattenObject(updates));
		if (keys.some((k) => k.startsWith('system.attributes.senses'))) {
			canvas.perception.update({ initializeVision: true }, true);
			this.reset();
		}
	}

	/** @inheritdoc */
	getBarAttribute(barName, { alternative } = {}) {
		const data = super.getBarAttribute(barName, { alternative });

		if (data && data.attribute === 'attributes.hp') {
			data.value += parseInt(
				foundry.utils.getProperty(this.actor.system, 'attributes.hp.temp') || 0,
				10,
			);
			data.max += parseInt(
				foundry.utils.getProperty(this.actor.system, 'attributes.hp.temp') || 0,
				10,
			);
		}

		return data;
	}
}
