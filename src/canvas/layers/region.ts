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
	override placeRegion(data: RDoc.CreateData, options?: RLayer.PlacementOptions) {
		if (!data.displayMeasurements) return super.placeRegion(data, options);
		if (data.highlightMode !== 'coverage') return super.placeRegion(data, options);

		// For cones, lines and walls
		const placement = { aiming: false };
		options ??= {} as RLayer.PlacementOptions;

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

		options.preConfirm = ({ event, shape }) => {
			const aim =
				// @ts-expect-error
				isAimable(shape.type) && canvas.grid?.type === CONST.GRID_TYPES.SQUARE && !event.shiftKey;

			if (!placement.aiming && aim) {
				placement.aiming = true;
				return false;
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

		return super.placeRegion(data, options);
	}

	/** Emanations should the token they are being drawn on */
	override _createDragShapeData(event: Canvas.Event.Pointer) {
		const shape = super._createDragShapeData(event);
		console.log(shape.base);
		if (!this.templateMode || shape.type !== 'emanation' || shape.base?.type !== 'token')
			return shape;

		const { x, y } = event.interactionData.origin;
		const tokens =
			canvas.tokens.quadtree
				?.getObjects(new PIXI.Rectangle(x, y, 0, 0))
				.values()
				.filter((t) => t.actor?.isCreature())
				.toArray() ?? [];

		if (tokens.length !== 1) return shape;

		const token = tokens[0].document;
		const base = shape.base as Record<string, any>;
		base.shape = token.shape;
		base.width = token.width;
		base.height = token.height;
		event.interactionData.origin = token.getCenterPoint();

		return shape;
	}
}
