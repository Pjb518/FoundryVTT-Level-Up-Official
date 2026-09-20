import { SceneA5E } from '../scene.ts';

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

	get dims() {
		return {
			length: this.height,
			width: this.width,
			height: this.height,
		};
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

	override prepareDerivedData() {
		super.prepareDerivedData();

		// Do this again to re-evaluate
		// @ts-expect-error
		// this.movementAction = this._inferMovementAction();
	}

	/** Updates the size of the token */
	updateTokenSize() {
		const actor = this.actor as Creature | undefined;
		if (!actor) return;
		if (!actor.isCreature()) return;

		const { size } = actor.system.traits;
		const absoluteScale = size === 'tiny' ? 0.5 : size === 'small' ? 0.8 : 1;

		const mirrorX = this.texture.scaleX < 0 ? -1 : 1;
		this.texture.scaleX = mirrorX * absoluteScale;
		const mirrorY = this.texture.scaleY < 0 ? -1 : 1;
		this.texture.scaleY = mirrorY * absoluteScale;
	}

	/** Handle changes in size from effects */
	override async _onOverrideSize(changes) {
		if (!this.persisted || this.object?.isPreview) this.updateSource(changes);
		else if (game.user.isActiveGM) this.update(changes);
	}

	/** ================================================================= */
	//  Detection Modes
	/** ================================================================= */
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

		if (actor?.isParty()) {
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

	/** ================================================================= */
	//  Movement Methods
	/** ================================================================= */
	override _inferMovementAction(): string {
		const actor = this.actor;
		if (!actor) return super._inferMovementAction();
		switch (actor.type) {
			case 'character':
			case 'npc':
				return !actor.inCombat ? 'travel' : actor.statuses.has('prone') ? 'crawl' : 'walk';
			case 'party':
				return 'travel';
			default:
				return 'walk';
		}
	}

	/** Get movement cost of a specific type  */
	static getMovementCostFunction(type: string, token: Token, options?: any) {
		const automate = game.settings.get('a5e', 'automateMovement');
		const { actor } = token;
		const movement = actor?.system?.attributes?.movement;
		const fallBack = ['climb', 'swim'].includes(type);
		const speed = movement?.[type].distance;
		const canMove = !!movement;

		// Improve this to factor in speed

		return !automate || !actor?.isCreature() || !canMove || speed || (!speed && !fallBack)
			? (cost: number) => cost
			: (cost: number, _from, _to, distance: number) => cost + distance;
	}

	static registerMovementActions() {
		const movementActions = CONFIG.Token.movement.actions;

		// Default action for walking unless prone
		movementActions.walk.canSelect = (token) => {
			const actor = token.actor;
			return !!actor?.isCreature() && !actor.statuses.has('prone');
		};
		movementActions.walk.getCostFunction = (...args) =>
			this.getMovementCostFunction('walk', ...args);

		// Default action when prone
		movementActions.crawl.canSelect = (token) => {
			const actor = token.actor;
			return !!actor?.isCreature() && actor.statuses.has('prone');
		};

		// Action for jumping
		movementActions.jump.order = 1;
		movementActions.jump.canSelect = (token) => {
			const actor = token.actor;
			return !!actor?.isCreature() && !actor.statuses.has('prone');
		};

		// Action for flying
		movementActions.fly.order = 2;
		movementActions.fly.canSelect = (token) => {
			const actor = token.actor;
			return !!actor?.isCreature() && !!actor.system.attributes.movement.fly.distance;
		};
		movementActions.fly.getCostFunction = (...args) => this.getMovementCostFunction('fly', ...args);

		// Action for burrowing
		movementActions.burrow.order = 3;
		movementActions.burrow.canSelect = (token) => {
			const actor = token.actor;
			return !!actor?.isCreature() && !!actor.system.attributes.movement.burrow.distance;
		};

		movementActions.burrow.getCostFunction = (...args) =>
			this.getMovementCostFunction('burrow', ...args);

		// Action for climbing
		movementActions.climb.order = 4;
		movementActions.climb.canSelect = (token) => {
			const actor = token.actor;
			return !!actor?.isCreature() && !!actor.system.attributes.movement.climb.distance;
		};
		movementActions.climb.getCostFunction = (...args) =>
			this.getMovementCostFunction('climb', ...args);

		// Action for swimming
		movementActions.swim.order = 5;
		movementActions.swim.canSelect = (token) => {
			const actor = token.actor;
			return !!actor?.isCreature();
		};
		movementActions.swim.getCostFunction = (...args) =>
			this.getMovementCostFunction('swim', ...args);

		// Action for travel
		// @ts-expect-error
		movementActions.travel = {
			order: 0,
			icon: 'fa-solid fa-person-hiking',
			label: 'Travel',
			canSelect: (token) => {
				const actor = token.actor;
				if (!actor) return false;
				return actor.isParty() || (actor.isCreature() && !actor.inCombat);
			},
		};

		// Movement Actions
		movementActions.blink.order = 6;
	}

	/** ================================================================= */
	//  Update Methods
	/** ================================================================= */

	override _onRelatedUpdate(
		update?: TokenDocument.OnRelatedUpdateData,
		operation?: TokenDocument.OnRelatedUpdateOperation,
	): void {
		super._onRelatedUpdate(update, operation);
		if (!(this.scene instanceof SceneA5E)) return;

		if (this.scene.isInFocus && this.scene.isView) this.reset();

		// Size sync Goes last
		const actor = this.actor;
		if (!actor?.isOwner) return;
		const activeGM = game.users.activeGM;

		const size = actor.system?.traits?.size;
		if ((!activeGM || game.user === activeGM) && this.autoScale && size) {
			const dim = CONFIG.A5E.tokenDimensions[size];
			if (this.width !== dim || this.height !== dim) {
				this.scene.syncTokenDimensions(this, { width: dim, height: dim });
			}
		}
	}

	/**
	 * Overrides base functionality and doesn't update unlinked tokens.
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
	override getBarAttribute(
		barName: string,
		{ alternative } = {} as TokenDocument.GetBarAttributeOptions,
	) {
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
