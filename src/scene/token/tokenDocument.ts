declare module 'fvtt-types/configuration' {
	interface DocumentClassConfig {
		Token: typeof TokenDocumentA5E;
	}
}

class TokenDocumentA5E extends TokenDocument {
	declare automateVision: boolean;

	declare charOnlyVisionAutomation: boolean;

	/** ================================================================= */
	// Getters
	/** ================================================================= */

	/** Autoscale this token? */
	get autoScale() {
		return this.actor?.isCreature()
			? (this.actor?.flags?.a5e?.automatePrototypeTokenSize ??
					game.settings.get('a5e', 'automatePrototypeTokenSize') ??
					true)
			: false;
	}

	/** The pixel-coordinate definition of this token's space */
	get bounds(): PIXI.Rectangle {
		const gridSize = this.scene?.grid.size ?? 100;

		return new PIXI.Rectangle(
			this._source.x,
			this._source.y,
			this.width * gridSize,
			this.height * gridSize,
		);
	}

	/** Returns if the token is in combat, though some actors have different conditions */
	override get inCombat() {
		return this.actorLink && this.actor?.isParty()
			? // @ts-expect-error
				this.actor.members.every((a) => game.combat?.getCombatantsByActor(a).length)
			: super.inCombat;
	}

	/** Check if the token is smaller than 1 grid */
	get isTiny() {
		return this.height < 1 || this.width < 1;
	}

	/** Bounds used for mechanics, such as flanking and drawing auras */
	get mechanicalBounds(): PIXI.Rectangle {
		const bounds = this.bounds;
		if (this.width < 1) {
			const position = canvas.grid!.getTopLeftPoint({
				x: bounds.x + bounds.width / 2,
				y: bounds.y + bounds.height / 2,
			});

			return new PIXI.Rectangle(
				position.x,
				position.y,
				Math.max(canvas.grid!.size, bounds.width),
				Math.max(canvas.grid!.size, bounds.height),
			);
		}

		return bounds;
	}

	/** The pixel-coordinate pair constituting this token's center */
	get center(): Canvas.Point {
		const bounds = this.bounds;
		return {
			x: bounds.x + bounds.width / 2,
			y: bounds.y + bounds.height / 2,
		};
	}

	/** Is this token's actor present and constructed? Synthetic actors are done so lazily. */
	get hasConstructedActor(): boolean {
		return this.actorLink
			? !!this.baseActor
			: !!(Object.getOwnPropertyDescriptor(this, 'delta')?.value && this.delta?.syntheticActor);
	}

	/** ================================================================= */
	// Data Prep Methods
	/** ================================================================= */

	override prepareBaseData() {
		this.updateTokenSize();
		super.prepareBaseData();
	}

	/** Updates the size of the token */
	updateTokenSize() {
		const actor = this.actor as Creature | undefined;
		if (!actor) return;
		if (!actor.isCreature()) return;

		const { size } = actor.system.traits;
		const numericalSize = CONFIG.A5E.tokenDimensions[size];

		this.width = numericalSize ?? this.width ?? 1;
		this.height = numericalSize ?? this.height ?? 1;
	}

	override _renderActiveEffectChanges(priorOverrides: Record<string, unknown>) {
		if (foundry.utils.equals(priorOverrides, this.overrides)) return;
		if (canvas.ready && canvas.scene === this.scene) {
			const {
				width: _w,
				height: _h,
				depth: _d,
				shape: _s,
				// @ts-expect-error
				...changes
			} = foundry.utils.mergeObject(
				foundry.utils.mergeObject(priorOverrides, this, { insertKeys: false, insertValues: false }),
				this.overrides,
			);

			// @ts-expect-error
			this.object?._onUpdate(changes, {}, game.user.id);
		}

		// Hand off size changes to a secondary handler requiring downstream implementation.
		const { width, height, depth, shape } = { ...priorOverrides, ...this.overrides };

		const sizeChanges = foundry.utils.deepClone(
			foundry.utils.diffObject(this._source, { width, height, depth, shape }),
			{ prune: true },
		);
		if (!foundry.utils.isEmpty(sizeChanges)) this._onOverrideSize(sizeChanges);
	}

	// TODO: Fix this
	override async _onOverrideSize(changes) {
		const { actor } = this;

		const { size } = actor.system.traits;
		const numericalSize = CONFIG.A5E.tokenDimensions[size];
		console.log(numericalSize);

		console.log(changes);

		const width = (changes.width || this.overrides.width) ?? numericalSize;
		const height = (changes.height || this.overrides.height) ?? numericalSize;
		this.update({ width, height });
	}

	/* ----------------------------------------
    Detection Mode
  ------------------------------------------- */
	override _prepareDetectionModes() {
		this.automateVision ??=
			(game.settings.storage
				.get('world')
				?.getItem('a5e.automateVisionRules') as unknown as boolean) ?? false;

		this.charOnlyVisionAutomation ??=
			(game.settings.storage
				.get('world')
				?.getItem('a5e.visionRulesApplyToCharactersOnly') as unknown as boolean) ?? true;

		const { scene } = this;
		let { actor } = this;

		if (actor.isParty()) {
			super._prepareDetectionModes();
			return;
		}

		if (!this.automateVision || !scene || !actor) {
			super._prepareDetectionModes();
			return;
		}

		if (actor.type === 'npc' && this.charOnlyVisionAutomation) {
			super._prepareDetectionModes();
			return;
		}

		actor = actor as Creature;

		const visionData = actor.visionData!;
		const lightPerception = { enabled: true, range: Infinity };
		const basicSight = { enabled: true, range: 0 };
		this.detectionModes = { lightPerception, basicSight };

		const visionMode = visionData.hasDarkvision ? 'darkvision' : 'basic';
		this.sight.enabled = true;
		this.sight.attenuation = 0.1;
		this.sight.brightness = 0;
		this.sight.contrast = 0;
		this.sight.range = 0;
		this.sight.saturation = 0;
		this.sight.visionMode = visionMode;

		const visionModeDefaults = CONFIG.Canvas.visionModes[visionMode].vision.defaults;
		this.sight.brightness = visionModeDefaults.brightness ?? 0;
		this.sight.saturation = visionModeDefaults.saturation ?? 0;

		if (visionMode === 'darkvision') {
			this.sight.range = basicSight.range = visionData.senses.darkvision.distance;
			// TODO: Add support for color darkvision
			this.sight.saturation = -1;
		}

		if (visionData.hasBlindsight) {
			this.detectionModes.blindsight = {
				enabled: true,
				range: visionData.senses.blindsight.distance ?? 0,
			};
		}

		if (visionData.hasTremorsense) {
			this.detectionModes.feelTremor = {
				enabled: true,
				range: visionData.senses.tremorsense.distance ?? 0,
			};
		}

		if (visionData.hasTruesight) {
			this.detectionModes.seeAll = {
				enabled: true,
				range: visionData.senses.truesight.distance ?? 0,
			};
		}

		if (!actor.statuses.has('deafened')) {
			this.detectionModes.hearing = { enabled: true, range: Infinity };
		}
	}

	/**
	 * Overrides base functionality and doesn't update unlinked tokens.
	 * @override
	 * */
	override _onUpdateBaseActor(update = {}, options = {}) {
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
	override getBarAttribute(barName, { alternative } = {}) {
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

export { TokenDocumentA5E };
