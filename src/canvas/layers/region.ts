import RDoc = foundry.documents.RegionDocument;
import RLayer = foundry.canvas.layers.RegionLayer;

const directionSnap = (type: string): number => (type === 'cone' ? 45 : 5);
const isAimable = (type: string): boolean => ['cone', 'line'].includes(type);
const snappingMode = (type: string) => {
	const MODES = CONST.GRID_SNAPPING_MODES;
	switch (type) {
		case 'cone':
			return MODES.CENTER | MODES.VERTEX | MODES.EDGE_MIDPOINT;
		case 'line':
			return MODES.EDGE_MIDPOINT | MODES.VERTEX;
		default:
			return MODES.CENTER | MODES.VERTEX;
	}
};

export class RegionLayerA5E extends RLayer {
	// @ts-expect-error
	override async placeRegion(data: RDoc.CreateData, options?: RLayer.PlacementOptions) {
		if (!data.displayMeasurements) return super.placeRegion(data, options);
		if (data.highlightMode !== 'coverage') return super.placeRegion(data, options);

		options ??= {} as RLayer.PlacementOptions;
		const isAura = foundry.utils.getProperty(data, 'flags.a5e.isAura') ?? false;

		// Set tokens to be interactive if emanation
		// @ts-expect-error
		if (data?.shapes?.some((s) => s.type === 'emanation')) options.attachToToken = true;

		// Don't render a placement for auras. Place them directly on the token
		if (isAura) {
			const auraData = foundry.utils.deepClone(data);
			const token = canvas?.scene?.tokens
				// @ts-expect-error
				.filter((t) => t.actor?.id === data.flags?.a5e?.actorId)
				.at(0);

			// @ts-expect-error
			if (token && auraData.shapes?.length === 1) {
				// Update aura data
				auraData.attachment = { token: token.id };
				const { x, y } = token.getCenterPoint();
				auraData.shapes[0].x = x;
				auraData.shapes[0].y = y;

				// Style Data
				auraData.displayMeasurements = false;
				auraData.visibility = CONST.REGION_VISIBILITY.LAYER;

				if (game.user.isGM) {
					return CONFIG.Region.documentClass.create(auraData, { parent: canvas.scene });
				} else {
					game.socket.emit('system.a5e', {
						request: 'placeBehaviorRegion',
						data: {
							document: auraData,
							sceneId: canvas.scene?.id,
						},
					});

					return;
				}
			}
		}

		// For cones, lines and walls
		const placement = { aiming: false };

		options.onMove = ({ event, position, shape, snap }) => {
			if (canvas.grid!.type !== CONST.GRID_TYPES.SQUARE) return;

			if (placement.aiming && isAimable(shape.type)) {
				// Point the shape at the cursor instead of dragging its origin around. Ctrl rotates freely
				const placed = shape;
				// @ts-expect-error
				const angle = Math.toDegrees(Math.atan2(position.y - placed.y, position.x - placed.x));
				const snapped =
					// @ts-expect-error
					event.ctrlKey || event.metaKEy ? angle : angle.toNearest(directionSnap(shape.type));
				// @ts-expect-error
				placed.updateSource({ rotation: snapped });
				return false;
			}

			if (!snap) return;

			const { x, y } = canvas!.grid!.getSnappedPoint(position, { mode: snappingMode(shape.type) });
			position.x = x;
			position.y = y;

			return;
		};

		options.onRotate = ({ event, shape }) => {
			if (!isAimable(shape.type) || canvas?.grid?.type !== CONST.GRID_TYPES.SQUARE) return;

			const placed = shape;
			const free = event.ctrlKey || event.metaKey;
			const step = free ? 5 : directionSnap(shape.type);
			const delta = step * Math.sign(event.deltaY);
			const rotation = placed.rotation + delta;

			// @ts-expect-error
			placed.updateSource({ rotation: free ? rotation : rotation.toNearest(step) });
			return false;
		};

		options.preConfirm = ({ event, document, shape }) => {
			const aim =
				// @ts-expect-error
				isAimable(shape.type) && canvas.grid?.type === CONST.GRID_TYPES.SQUARE && !event.shiftKey;

			if (!placement.aiming && aim) {
				placement.aiming = true;
				return false;
			}

			if (shape.type === 'emanation' && !isAura) {
				// @ts-expect-error
				this._placementContext.attachToToken = false;
				document.updateSource({ attachment: { token: null } });
			}

			return undefined;
		};

		options.preSkip = () => {
			if (placement.aiming) {
				placement.aiming = false;
				return false;
			}

			return undefined;
		};

		// @ts-expect-error
		if (data.behaviors?.length > 0 && !game.user.isGM) {
			options.create = false;
		}

		const placedDoc = await super.placeRegion(data, options);

		// @ts-expect-error
		if (data.behaviors?.length > 0 && !game.user.isGM) {
			game.socket.emit('system.a5e', {
				request: 'placeBehaviorRegion',
				data: {
					document: placedDoc,
					sceneId: canvas.scene?.id,
				},
			});
		}

		return placedDoc;
	}

	/** Emanations should the token they are being drawn on */
	override _createDragShapeData(event: Canvas.Event.Pointer) {
		const shape = super._createDragShapeData(event);
		// @ts-expect-error
		if (!this.templateMode || shape.type !== 'emanation' || shape.base?.type !== 'token')
			return shape;

		// @ts-expect-error
		const { x, y } = event.interactionData.origin;
		const tokens =
			canvas.tokens.quadtree
				?.getObjects(new PIXI.Rectangle(x, y, 0, 0))
				.values()
				// @ts-expect-error
				.filter((t) => t.actor?.isCreature())
				.toArray() ?? [];

		if (tokens.length !== 1) return shape;

		const token = tokens[0].document;

		// @ts-expect-error
		this.#updateEmanationBase(shape, token);
		event.interactionData.origin = token.getCenterPoint();

		return shape;
	}

	#updateEmanationBase(
		shape: foundry.data.EmanationShapeData,
		token: TokenDocument.Implementation,
	) {
		const base = shape.base;
		base.shape = token.shape;
		base.width = token.width;
		base.height = token.height;

		return shape;
	}
}
