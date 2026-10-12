import fields = foundry.data.fields;
import TerrainData = foundry.data.TerrainData;

// ======================================================
//                      Schema
// ======================================================
const schema = () => ({
	difficultTerrain: new fields.BooleanField({ required: true, nullable: false, initial: false }),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace TerrainDataA5E {
	type Schema = TerrainData.Schema & ReturnType<typeof schema>;

	interface TerrainEffect extends Omit<TerrainData.TerrainEffect, 'name'> {
		name: 'difficulty' | 'difficultTerrain';
	}
}

// ======================================================
//                      Class
// ======================================================
class TerrainDataA5E extends TerrainData<TerrainDataA5E.Schema> {
	/** @inheritdoc */
	static override defineSchema(): TerrainDataA5E.Schema {
		return {
			...super.defineSchema(),
			...schema(),
		};
	}

	/** @inheritdoc */
	static override getMovementCostFunction(
		token: TokenDocument.Implementation,
		options?: TokenDocument.MeasureMovementPathOptions,
	): TokenDocument.MovementCostFunction | void {
		if (token.actor?.isCreature()) {
			return (_from, _to, distance, segment) => {
				let difficulty = segment.terrain?.difficulty;

				if (Number.isFinite(difficulty) && segment.terrain.difficultTerrain && segment.teleport)
					difficulty -= 1;
				return distance * (difficulty ?? 1);
			};
		}

		return (_from, _to, distance) => distance;
	}

	/** @inheritdoc */
	static override resolveTerrainEffects(
		effects: TerrainDataA5E.TerrainEffect[],
	): TerrainDataA5E | null {
		const automate = game.settings.get('a5e', 'automateMovement');

		const data = super.resolveTerrainEffects(
			effects as TerrainData.TerrainEffect[],
		) as TerrainDataA5E | null;

		if (!automate || !effects.some((e) => e.name === 'difficultTerrain')) return data;
		if (!data) return new this({ difficulty: 2, difficultTerrain: true });

		const difficulty = Number.isFinite(data.difficulty) ? data.difficulty! + 1 : null;

		data.updateSource({ difficulty, difficultTerrain: true });
		return data;
	}

	/** @inheritdoc */
	override equals(other: TerrainData.Implementation): boolean {
		if (!(other instanceof TerrainDataA5E)) return false;

		return this.difficulty === other.difficulty && this.difficultTerrain === other.difficultTerrain;
	}
}

export { TerrainDataA5E };
