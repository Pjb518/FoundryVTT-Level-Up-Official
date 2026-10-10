import TokenRuler = foundry.canvas.placeables.tokens.TokenRuler;
import BaseGrid = foundry.grid.BaseGrid;

// TODO: Add custom context for label

class TokenRulerA5E extends TokenRuler {
	#getSpeedBasedStyle(waypoint: TokenRuler.Waypoint, style: TokenRulerA5E.Style) {
		const token = this.token;
		const actor = token.actor as Creature | undefined;

		// If showing a different client's measurement, use default style
		if (
			// @ts-expect-error
			!(game.user.id in this.token._plannedMovement) ||
			CONFIG.Token.movement.actions[waypoint.action]?.teleport
		) {
			return style;
		}

		if (!actor) return style;
		if (!actor.isCreature()) return style;

		// Return if not in combat
		if (!actor.inCombat) return style;

		// Get speed for current action
		const movement = actor.system.attributes.movement;
		if (!movement) return style;

		let currentSpeed = movement[waypoint.action]?.distance ?? 0;

		if (['climb', 'swim'].includes(waypoint.action)) {
			currentSpeed = Math.max(currentSpeed, movement.walk.distance);
		}

		// Apply Color
		const inc = (waypoint.measurement.cost - 0.1) / currentSpeed;
		if (inc <= 1) style.color = '0x33BC4E';
		else if (inc <= 2) style.color = '0xF1D836';
		else style.color = '0xE72124';

		return style;
	}

	/** @inheritdoc */
	protected override _getSegmentStyle(waypoint: TokenRuler.Waypoint): Ruler.SegmentStyle {
		const style = super._getSegmentStyle(waypoint);
		// @ts-expect-error
		return this.#getSpeedBasedStyle(waypoint, style);
	}

	/** @inheritdoc */
	protected override _getGridHighlightStyle(
		waypoint: TokenRuler.Waypoint,
		offset: BaseGrid.Offset3D,
	): TokenRuler.GridHighlightStyle {
		const style = super._getGridHighlightStyle(waypoint, offset);
		return this.#getSpeedBasedStyle(waypoint, style);
	}

	/** @inheritdoc*/
	protected override _getWaypointStyle(waypoint: TokenRuler.Waypoint): TokenRuler.WaypointStyle {
		const noStyle =
			!waypoint.explicit &&
			waypoint.next &&
			waypoint.previous &&
			waypoint.actionConfig.visualize &&
			waypoint.next.actionConfig.visualize &&
			waypoint.action === waypoint.next.action &&
			(waypoint.unreachable || !waypoint.next.unreachable);

		if (noStyle) return { radius: 0 };

		const user = game.users.get(waypoint.userId ?? '');
		if (!user) return { radius: 0 };

		const scale = canvas.dimensions?.uiScale ?? 1;
		const style = { radius: 6 * scale, color: user.color, alpha: waypoint.explicit ? 1 : 0.5 };

		// @ts-expect-error
		return this.#getSpeedBasedStyle(waypoint, style);
	}
}

declare namespace TokenRulerA5E {
	type Style = TokenRuler.WaypointStyle | Ruler.SegmentStyle | TokenRuler.GridHighlightStyle;
}

export { TokenRulerA5E };
