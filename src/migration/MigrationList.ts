import type { MigrationBase } from './MigrationBase';
import { MigrationRunnerFoundry } from './runner/foundryRunner';
import * as Migrations from './migrations/index';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class MigrationList {
	static #list: { new (): MigrationBase; version: number }[] = Object.values(Migrations);

	static get latestVersion(): number {
		return Math.max(...MigrationList.#list.map((m) => m.version));
	}

	static constructAll(): MigrationBase[] {
		return MigrationList.#list.map((M) => new M());
	}

	static constructFromVersion(version?: number) {
		const minVersion = Number(version) || MigrationRunnerFoundry.RECOMMENDED_SAFE_VERSION;

		return MigrationList.#list.reduce((acc, M) => {
			if (M.version > minVersion) acc.push(new M());
			return acc;
		}, [] as MigrationBase[]);
	}

	static constructFromLatestVersion(version?: number): MigrationBase[] {
		const minVersion = Number(version) - 0.001 || MigrationRunnerFoundry.RECOMMENDED_SAFE_VERSION;

		return MigrationList.#list.reduce((acc, M) => {
			if (M.version > minVersion) acc.push(new M());
			return acc;
		}, [] as MigrationBase[]);
	}

	static constructRange(min: number, max = Number.POSITIVE_INFINITY) {
		return MigrationList.#list.reduce((acc, M) => {
			if (M.version >= min && M.version <= max) acc.push(new M());
			return acc;
		}, [] as MigrationBase[]);
	}
}

export { MigrationList };
