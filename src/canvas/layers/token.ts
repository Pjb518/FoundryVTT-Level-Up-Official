import type { TokenA5E } from '../token/token.ts';

import TokenLayer = foundry.canvas.layers.TokenLayer;

declare module 'fvtt-types/configuration' {
	interface PlaceablesLayerConfig {
		TokenLayer: typeof TokenLayerA5E;
	}
}

class TokenLayerA5E extends TokenLayer {
	/** A line showing the distance between 2 tokens */
	#hoverDistanceLine: PIXI.Graphics;

	constructor() {
		super();
		this.#hoverDistanceLine = this._rulerPaths.addChild(new PIXI.Graphics());
	}

	refreshDistanceLine(): void;
	refreshDistanceLine(from: TokenA5E, to: TokenA5E): Canvas.Point;
	refreshDistanceLine(from?: TokenA5E, to?: TokenA5E): Canvas.Point | void {
		this.#hoverDistanceLine.clear();
		if (!(from && to)) return;
		this._rulerPaths.addChild(this._rulerPaths.removeChild(this.#hoverDistanceLine));

		const centers = { from: from.center, to: to.center };
		const footprints = {
			from: from.footprint
				.map((o) => canvas.grid!.getCenterPoint(o))
				.sort(
					(a, b) =>
						Math.sqrt((a.x - centers.to.x) ** 2 + (a.y - centers.to.y) ** 2) -
						Math.sqrt((b.x - centers.to.x) ** 2 + (b.y - centers.to.y) ** 2),
				),

			to: to.footprint
				.map((o) => canvas.grid!.getCenterPoint(o))
				.sort(
					(a, b) =>
						Math.sqrt((a.x - centers.to.x) ** 2 + (a.y - centers.to.y) ** 2) -
						Math.sqrt((b.x - centers.to.x) ** 2 + (b.y - centers.to.y) ** 2),
				),
		};

		const closest = { from: footprints.from[0], to: footprints.to[0] };
		const line = this.#hoverDistanceLine;
		const colors = { outline: 0, fill: 0x999999 };

		line
			.moveTo(closest.from.x, closest.from.y)
			// @ts-expect-error
			.lineStyle({
				width: 6 * canvas.dimensions!.uiScale,
				color: colors.outline,
				join: PIXI.LINE_JOIN.ROUND,
				cap: PIXI.LINE_CAP.ROUND,
			})
			.lineTo(closest.to.x, closest.to.y)
			.moveTo(closest.from.x, closest.from.y)
			// @ts-expect-error
			.lineStyle({
				width: 6 * canvas.dimensions!.uiScale,
				color: colors.outline,
				join: PIXI.LINE_JOIN.ROUND,
				cap: PIXI.LINE_CAP.ROUND,
			})
			.lineTo(closest.to.x, closest.to.y);

		this.#drawCap(line, closest.from, colors);
		this.#drawCap(line, closest.to, colors);
		return closest.to;
	}

	#drawCap(
		line: PIXI.Graphics,
		p: Canvas.Point,
		colors: { outline: number; fill: number },
	): PIXI.Graphics {
		const radius = 6;
		return line
			.lineStyle(0)
			.beginFill(colors.outline)
			.drawCircle(p.x, p.y, radius + 1)
			.endFill()
			.beginFill(colors.fill)
			.drawCircle(p.x, p.y, radius)
			.endFill();
	}
}

export { TokenLayerA5E };
