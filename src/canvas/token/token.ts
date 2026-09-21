import TokenPreviewManger from '#managers/TokenPreviewManager.ts';
import sizeScales from './utils/sizeScales.ts';

import BaseGrid = foundry.grid.BaseGrid;

import { measureDistanceCuboid, squareAtPoint } from '../utils.ts';

let circularMask = null;

declare module 'fvtt-types/configuration' {
	interface PlaceableObjectClassConfig {
		Token: typeof TokenA5E;
	}
}

class TokenA5E extends foundry.canvas.placeables.Token {
	static override RENDER_FLAGS: TokenA5E.RENDER_FLAGS = (() => {
		const flags = Object.assign(super.RENDER_FLAGS, { refreshDistanceLabel: {} });
		flags.refreshState.propagate?.push('refreshDistanceLabel');
		return flags;
	})();

	/** ================================================================= */
	// Getters
	/** ================================================================= */

	/** Can the current user see the distance of this token from a controlled token? */
	get #canSeeDistance(): boolean {
		if (
			!this.visible ||
			this.isPreview ||
			this.document.isSecret ||
			this.controlled ||
			this.animation
		) {
			return false;
		}
		return (
			this.hover &&
			(this.layer.controlled.length === 1 || !!game.user.character?.getActiveTokens().length)
		);
	}

	/** A reference to an animation that is currently in progress for this Token, if any */
	get animation(): Promise<void> | null {
		return (
			this.animationContexts.get(this.animationName)?.promise ??
			this.animationContexts.get(this.movementAnimationName)?.promise ??
			null
		);
	}

	/** Gets dims of a token */
	get dims() {
		return this.document.dims;
	}

	/** The grid offsets representing this token's shape */
	get footprint(): BaseGrid.Offset2D[] {
		const shape = this.document.isTiny ? this.mechanicalBounds : this.localShape;
		const seen = new Set<number>();
		const offsets: BaseGrid.Offset2D[] = [];
		const [i0, j0, i1, j1] = canvas.grid!.getOffsetRange(this.mechanicalBounds);
		for (let i = i0; i < i1; i++) {
			for (let j = j0; j < j1; j++) {
				const offset = { i, j };
				const packed = (offset.i << 16) + offset.j;
				if (seen.has(packed)) continue;
				seen.add(packed);
				const point = canvas.grid!.getCenterPoint(offset);
				if (shape!.contains(point.x, point.y)) {
					offsets.push(offset);
				}
			}
		}
		return offsets.sort((a, b) => a.j - b.j).sort((a, b) => a.i - b.i);
	}

	/** The ID of the highlight layer for this token */
	get highlightId(): string {
		return `Token.${this.id}`;
	}

	/** Is this token currently animating? */
	get isAnimating(): boolean {
		return !!this.animation;
	}

	/** This token's shape at its canvas position */
	get localShape() {
		switch (this.shape!.type) {
			case PIXI.SHAPES.RECT:
				return this.bounds;
			case PIXI.SHAPES.POLY: {
				const shape = this.shape!.clone();
				const bounds = this.bounds;
				shape.points = shape.points.map((c, i) => (i % 2 === 0 ? c + bounds.x : c + bounds.y));
				return shape;
			}
			case PIXI.SHAPES.ELIP:
			case PIXI.SHAPES.CIRC: {
				const shape = this.shape!.clone();
				const center = this.center;
				shape.x = center.x;
				shape.y = center.y;
				return shape;
			}
		}

		return this.shape;
	}

	/** Bounds used for mechanics, such as flanking and drawing auras */
	get mechanicalBounds(): PIXI.Rectangle {
		const bounds = this.bounds;
		if (this.document.isTiny) {
			const position = canvas.grid!.getTopLeftPoint(bounds);
			return new PIXI.Rectangle(
				position.x,
				position.y,
				Math.max(canvas.grid!.size, bounds.width),
				Math.max(canvas.grid!.size, bounds.height),
			);
		}

		return bounds;
	}

	/** ================================================================= */
	// Distance and Mechanical Methods
	/** ================================================================= */

	/** Publicly expose `Token#_canControl` for use in `TokenLayerPF2e`. */
	canControl(user: User, event: PIXI.FederatedPointerEvent): boolean {
		// @ts-expect-error
		return this._canControl(user, event);
	}

	/**
	 * Measure the distance between this token and another object or point, in grid distance. We measure between the
	 * centre of squares, and if either covers more than one square, we want the minimum distance between
	 * any two of the squares.
	 */
	distanceTo(
		target: TokenA5E.TokenOrPoint,
		{ reach = null }: { reach?: number | null } = {},
	): number {
		if (!canvas.ready) return NaN;
		if (this === target) return 0;

		const selfElevation = this.document.elevation;
		const targetElevation = target.document?.elevation ?? selfElevation;
		if (canvas.grid!.type !== CONST.GRID_TYPES.SQUARE) {
			const waypoints = [
				{ x: this.x, y: this.y, elevation: selfElevation },
				{ x: target.x, y: target.y, elevation: targetElevation },
			];
			// @ts-expect-error
			return Math.round(canvas.grid!.measurePath(waypoints).distance);
		}

		const targetBounds = target.mechanicalBounds ?? squareAtPoint(target);
		if (
			selfElevation === targetElevation ||
			!this.actor ||
			!target.mechanicalBounds ||
			!target.actor
		) {
			return measureDistanceCuboid(this.mechanicalBounds, targetBounds, { reach });
		}
		return measureDistanceCuboid(this.mechanicalBounds, targetBounds, {
			reach,
			token: this,
			target,
		});
	}

	/** ================================================================= */
	// Render / Refresh Methods
	/** ================================================================= */
	override _applyRenderFlags(flags: Record<string, boolean>) {
		super._applyRenderFlags(flags);
		if (flags.refreshDistanceLabel) this.#refreshDistanceLabel();
	}

	override _refreshState(): void {
		super._refreshState();
		const distanceLabelEl = document.getElementById('token-hover-distance');
		if (distanceLabelEl) distanceLabelEl.hidden = !this.#canSeeDistance;
	}

	#refreshDistanceLabel(): void {
		this.layer.refreshDistanceLine();
		if (!game.combat?.started) return;

		const labelEl = document.getElementById('token-hover-distance');
		if (!this.#canSeeDistance || !labelEl) {
			if (labelEl) labelEl.hidden = true;
			return;
		}

		const controlledToken = this.layer.controlled[0] ?? game.user.character?.getActiveTokens()[0];
		if (!controlledToken || controlledToken.isPreview || controlledToken.animation) return;

		const totalEl = labelEl.querySelector('.total-measurement');
		if (!totalEl) {
			console.error('Failed to retrieve measument element');
			return;
		}

		const distance = controlledToken.distanceTo(this);
		if (distance < canvas.grid!.distance) {
			labelEl.hidden = true;
			return;
		}

		const label = [distance, canvas.scene?.grid.units ?? ''].join(' ').trim();
		totalEl.textContent = label;
		labelEl.dataset.tokenId = this.document.id!;
		labelEl.style.setProperty('--position-y', `${this.y}px`);
		labelEl.style.setProperty('--ui-scale', canvas.dimensions!.uiScale.toString());
		labelEl.hidden = false;
		const square = this.layer.refreshDistanceLine(controlledToken, this);
		labelEl.style.setProperty('--position-x', `${square.x}px`);
	}

	/** ================================================================= */
	// Status Effect Methods
	/** ================================================================= */
	_getActiveConditions() {
		return [...(this.actor?.statuses ?? [])];
	}

	// @ts-expect-error
	_addStatusEffect({ id, src }, { overlay } = {}) {
		if (['corruption', 'fatigue', 'exhaustion', 'inebriated', 'strife'].includes(id)) {
			return this.actor?.toggleStatusEffect(id, { active: true, overlay });
		}

		const activeConditions = this._getActiveConditions();
		if (activeConditions.includes(id)) return this._removeStatusEffect({ id, src }, { overlay });
		return this.actor?.toggleStatusEffect(id, { active: true, overlay });
	}

	// @ts-expect-error
	_removeStatusEffect({ id, src }, { overlay } = {}) {
		if (['corruption', 'fatigue', 'exhaustion', 'inebriated', 'strife'].includes(id)) {
			return this.actor?.toggleStatusEffect(id, { active: false, overlay });
		}

		return this.actor?.toggleStatusEffect(id, { active: false, overlay });
	}

	/** ================================================================= */
	// Bar Methods
	/** ================================================================= */
	/** @inheritdoc */
	override _drawBar(
		index: number,
		bar: PIXI.Graphics,
		data: NonNullable<TokenDocument.GetBarAttributeReturn>,
	) {
		if (data.attribute === 'attributes.hp') return this._drawHPBar(index, bar);
		return super._drawBar(index, bar, data);
	}

	/* -------------------------------------------- */

	/** Specialized drawing function for HP bars. */
	_drawHPBar(index: number, bar: PIXI.Graphics) {
		// Extract health data
		const { value, max, temp } = this.document.actor?.system?.attributes?.hp ?? {};
		if (!value || !max || !temp) return;

		// Allocate percentages of the total
		const tempPct = Math.clamp(temp, 0, max) / max;
		const valuePct = Math.clamp(value, 0, max) / max;
		const colorPct = Math.clamp(value, 0, max) / max;

		// Determine colors to use
		const blk = 0x000000;
		// const hpColor = PIXI.utils.rgb2hex([1 - colorPct / 2, colorPct, 0]);
		const hpColor = PIXI.Color.shared.setValue([1 - colorPct / 2, colorPct, 0]).toNumber();
		const c = CONFIG.A5E.tokenHPColors;

		// Determine the container size (logic borrowed from core)
		const { w } = this;
		let h = Math.max(canvas.dimensions!.size / 12, 8);
		if (this.document.height >= 2) h *= 1.6;
		const bs = Math.clamp(h / 8, 1, 2);
		const bs1 = bs + 1;

		// Overall bar container
		bar.clear();
		bar.beginFill(blk, 0.5).lineStyle(bs, blk, 1.0).drawRoundedRect(0, 0, w, h, 3);

		// Health bar
		bar
			.beginFill(hpColor, 1.0)
			.lineStyle(bs, blk, 1.0)
			.drawRoundedRect(0, 0, valuePct * w, h, 2);

		// Temporary hit points
		if (temp > 0) {
			// eslint-disable-next-line max-len
			bar
				.beginFill(c.temp, 1.0)
				.lineStyle(0)
				.drawRoundedRect(bs1, bs1, tempPct * w - 2 * bs1, h - 2 * bs1, 1);
		}

		// Set position
		const posY = index === 0 ? this.h - h : 0;
		bar.position.set(0, posY);
	}

	/** ================================================================= */
	// Radial Effects
	/** ================================================================= */
	override _refreshEffects() {
		super._refreshEffects();
		if (!game.settings.get('a5e', 'enableRadialEffects')) return;
		if (!this.effects) return;

		const background = this.effects.children[0];
		if (!(background instanceof PIXI.Graphics)) return;
		background.clear();

		// const icons = this.effects.children.slice(1, 1 + effectsCount);
		const icons = this.effects.children.filter((e) => {
			if (e === this.effects?.overlay) return false;
			if (e === this.effects?.bg) return false;

			return true;
		});

		const tokenSize = Math.max(this.document.height, this.document.width);
		const gridSize = this?.scene?.grid?.size ?? 100;

		const max = sizeScales.maxIcons(tokenSize) ?? 10;
		let ringCounter = 0;

		icons.forEach((icon, idx) => {
			if (!(icon instanceof PIXI.Sprite)) return;
			if (idx !== 0 && idx % max === 0) ringCounter += 1;

			icon.anchor.set(0.5);

			const iconScale = sizeScales.iconScale(tokenSize) ?? 1.4;
			const gridScale = gridSize / 100;
			const scaledSize = 12 * iconScale * gridScale;

			// Update icon size
			icon.width = scaledSize;
			icon.height = scaledSize;

			// Update icon position
			const ratio = idx / max;
			const tokenTileFactor = this?.document?.width ?? 1;
			const ringOffset = sizeScales.ringOffset(tokenSize) * ringCounter;
			const sizeOffset = (sizeScales.sizeOffset(tokenSize) ?? 1.4) + ringOffset;
			const offset = sizeOffset * tokenTileFactor * gridSize;
			const ringRotation = ringCounter % 2 === 0 ? 0 : sizeScales.ringRotation(tokenSize);
			const rotation = (0.5 + (1 / max) * Math.PI) * Math.PI;
			const theta = (ratio + ringRotation) * 2 * Math.PI + rotation;
			const x = Math.cos(theta) * offset;
			const y = Math.sin(theta) * offset;

			icon.position.x = x / 2 + (gridSize * tokenTileFactor) / 2;
			icon.position.y = (-1 * y) / 2 + (gridSize * tokenTileFactor) / 2;

			// Update background
			const radius = icon.width / 2;
			background.lineStyle((1 * gridScale) / 2, 0xe9d7a1, 1, 0);
			background.drawCircle(icon.position.x, icon.position.y, radius + 1 * gridScale);
			// background.beginFill(0x292929);
			background.beginFill(0x000000, 0.6);
			background.drawCircle(icon.position.x, icon.position.y, radius + 1 * gridScale);
			background.endFill();
		});
	}

	/**
	 * @override
	 */
	// @ts-expect-error
	override async _drawEffect(src: string, tint: PIXI.ColorSource | null, isOverlay = false) {
		if (!game.settings.get('a5e', 'enableRadialEffects')) return super._drawEffect(src, tint);
		if (!this.effects) return super._drawEffect(src, tint);

		if (!src) return null;

		const texture = await foundry.canvas.loadTexture(src, {
			fallback: 'icons/svg/hazard.svg',
		});

		// @ts-expect-error
		const icon = new PIXI.Sprite(texture);

		if (isOverlay) {
			if (tint) icon.tint = tint;
			return this.effects.addChild(icon);
		}

		if (!circularMask) {
			circularMask = PIXI.RenderTexture.create(110, 110);
			const spriteMask = new PIXI.Graphics().beginFill(0xffffff).drawCircle(55, 55, 55).endFill();
			const blurFilter = new PIXI.filters.BlurFilter(2);
			spriteMask.filters = [blurFilter];
			canvas.app.renderer.render(spriteMask, circularMask);
		}

		const minDimension = Math.min(icon.width, icon.height);

		const mask = new PIXI.Graphics().beginFill(0xffffff).drawCircle(55, 55, 55).endFill();
		mask.width = minDimension;
		mask.height = minDimension;
		mask.x = -icon.width / 2;
		mask.y = -icon.height / 2;

		icon.mask = mask;
		icon.addChild(mask);

		if (tint) icon.tint = tint;

		return this.effects.addChild(icon);
	}

	/** Override _drawOverlay to add isOverlay */
	// @ts-expect-error
	override async _drawOverlay(src: string, tint: number | null) {
		if (!game.settings.get('a5e', 'enableRadialEffects')) return super._drawOverlay(src, tint);
		if (!this.effects) return super._drawOverlay(src, tint);

		const icon = await this._drawEffect(src, tint, true);
		if (icon) icon.alpha = 0.8;
		this.effects.overlay = icon ?? null;
		return icon;
	}

	// ********************************************************************
	//                         Token Preview Draw
	// ********************************************************************
	async drawPreview() {
		const PreviewManager = new TokenPreviewManger(this);
		return PreviewManager.preview();
	}
}

declare namespace TokenA5E {
	interface RENDER_FLAGS extends Token.RENDER_FLAGS {
		refreshDistanceLabel: any;
	}

	type TokenOrPoint =
		| TokenA5E
		| (Canvas.Point & { actor?: never; document?: never; mechanicalBounds?: never });
}

export { TokenA5E };
