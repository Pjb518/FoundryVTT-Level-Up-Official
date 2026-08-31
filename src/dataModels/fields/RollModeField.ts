import DataModel = foundry.abstract.DataModel;
import NumberField = foundry.data.fields.NumberField;

export type RollModeData = {
	override: { value: number | null; source: string | null };
	advantages: { count: number; suppressed: boolean; sources: string[] };
	disadvantages: { count: number; suppressed: boolean; sources: string[] };
};

class RollModeField<
	const Options extends NumberField.Options = NumberField.DefaultOptions,
	const AssignmentType = NumberField.AssignmentType<Options>,
	const InitializedType = NumberField.InitializedType<Options>,
	const PersistedType extends number | null | undefined = NumberField.InitializedType<Options>,
> extends NumberField<Options, AssignmentType, InitializedType, PersistedType> {
	static override get _defaults() {
		const defaults = super._defaults;
		return {
			...defaults,
			choices: RollModeField.#values,
			initial: 0,
			nullable: false,
			required: true,
		};
	}

	static #values = [-1, 0, 1];

	/* -------------------------------------------- */
	//  Active Effect Integration
	/* -------------------------------------------- */
	override _applyChangeAdd(
		value: InitializedType,
		delta: InitializedType,
		model: DataModel.Any,
		change: ActiveEffect.ChangeData,
	): InitializedType {
		if (delta !== -1 && delta !== 1) return value;
		const counts = RollModeField.getCounts(model, change.key!);
		if (delta === 1) {
			counts.advantages.count++;
			counts.advantages.sources.push(change?.effect?.name || '');
		} else {
			counts.disadvantages.count++;
			counts.disadvantages.sources.push(change?.effect?.name || '');
		}

		return RollModeField.resolveRollMode(model, change, counts) as InitializedType;
	}

	protected override _applyChangeSubtract(
		value: InitializedType,
		delta: InitializedType,
		model: DataModel.Any,
		change: ActiveEffect.ChangeData,
	): InitializedType {
		if (delta !== -1 && delta !== 1) return value;
		const counts = RollModeField.getCounts(model, change);
		if (delta === 1) {
			counts.advantages.count--;
			counts.advantages.sources.push(change?.effect?.name || '');
		} else {
			counts.disadvantages.count--;
			counts.disadvantages.sources.push(change?.effect?.name || '');
		}

		return RollModeField.resolveRollMode(model, change, counts) as InitializedType;
	}

	protected override _applyChangeDowngrade(
		value: InitializedType,
		delta: InitializedType,
		model: DataModel.Any,
		change: ActiveEffect.ChangeData,
	): InitializedType {
		// Downgrade the roll so that it can no longer benefit from advantage.
		if (delta !== -1 && delta !== 0) return value;
		const counts = RollModeField.getCounts(model, change);

		counts.advantages.suppressed = true;
		if (delta === -1) {
			counts.disadvantages.count++;
			counts.disadvantages.sources.push(change?.effect?.name || '');
		}

		return RollModeField.resolveRollMode(model, change, counts) as InitializedType;
	}

	protected override _applyChangeMultiply(
		value: InitializedType,
		delta: InitializedType,
		model: DataModel.Any,
		change: ActiveEffect.ChangeData,
	): InitializedType {
		return value;
	}

	protected override _applyChangeOverride(
		value: InitializedType,
		delta: InitializedType,
		model: DataModel.Any,
		change: ActiveEffect.ChangeData,
	): InitializedType | undefined {
		// Force a given roll mode.
		if (delta === -1 || delta === 0 || delta === 1) {
			const counts = RollModeField.getCounts(model, change);
			counts.override.value = delta as number;
			counts.override.source = change.effect?.name || '';
			counts;

			return delta;
		}

		return value;
	}

	protected override _applyChangeUpgrade(
		value: InitializedType,
		delta: InitializedType,
		model: DataModel.Any,
		change: ActiveEffect.ChangeData,
	): InitializedType {
		// Upgrade the roll so that it can no longer be penalised by disadvantage.
		if (delta !== 1 && delta !== 0) return value;

		const counts = RollModeField.getCounts(model, change);
		counts.disadvantages.suppressed = true;
		if (delta === 1) {
			counts.advantages.count++;
			counts.advantages.sources.push(change?.effect?.name || '');
		}

		return RollModeField.resolveRollMode(model, change, counts) as InitializedType;
	}

	/* -------------------------------------------- */
	//  Helpers
	/* -------------------------------------------- */
	static getCounts(model: DataModel.Any, _keyPath: ActiveEffect.ChangeData | string): RollModeData {
		// @ts-expect-error
		const keyPath: string = foundry.utils.getType(_keyPath) === 'Object' ? _keyPath.key : _keyPath;

		const parentKey = keyPath.substring(0, keyPath.lastIndexOf('.'));
		const _default = {
			rollModeCounts: {
				override: { value: null, source: null },
				advantages: { count: 0, suppressed: false, sources: [] },
				disadvantages: { count: 0, suppressed: false, sources: [] },
			},
		};

		const roll = (foundry.utils.getProperty(model, parentKey) as typeof _default) ?? _default;

		roll.rollModeCounts ??= _default.rollModeCounts;
		return roll.rollModeCounts;
	}

	static resolveRollMode(
		model: DataModel.Any,
		_keyPath: ActiveEffect.ChangeData | string,
		counts: RollModeData,
	) {
		// @ts-expect-error
		const keyPath: string = foundry.utils.getType(_keyPath) === 'Object' ? _keyPath.key : _keyPath;

		const { override, advantages, disadvantages } = counts ?? this.getCounts(model, keyPath);
		if (override.value !== null) return override;

		const src = foundry.utils.getProperty(model._source, keyPath) ?? 0;
		const advantageCount = advantages.suppressed
			? 0
			: Math.max(0, advantages.count + Number(src === 1));

		const disadvantageCount = disadvantages.suppressed
			? 0
			: Math.max(0, disadvantages.count + Number(src === -1));

		return Math.sign(advantageCount) - Math.sign(disadvantageCount);
	}

	static setRollMode(
		model: DataModel.Any,
		keyPath: string,
		value: number,
		{ override = false } = {},
	) {
		const field = keyPath.startsWith('system.')
			? //@ts-expect-error
				model.system.schema.getField(keyPath.slice(7))
			: model.schema.getField(keyPath);

		if (!field) {
			console.error(`No field found at "${keyPath}" to apply advantage to.`);
			return 0;
		}

		const type = override ? 'override' : 'add';
		const change = { key: keyPath, value, type };
		const final = field.applyChange(foundry.utils.getProperty(model, keyPath), model, change);

		foundry.utils.setProperty(model, keyPath, final);
		return final;
	}
}

export { RollModeField };
