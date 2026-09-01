import { A5E } from '../../config.ts';

import DataModel = foundry.abstract.DataModel;
import NumberField = foundry.data.fields.NumberField;

export type ExpertiseDieData = {
	override: string | null;
	sources: string[];
};

class ExpertiseDieField<
	const Options extends NumberField.Options = NumberField.DefaultOptions,
	const AssignmentType = NumberField.AssignmentType<Options>,
	const InitializedType = NumberField.InitializedType<Options>,
	const PersistedType extends number | null | undefined = NumberField.InitializedType<Options>,
> extends NumberField<Options, AssignmentType, InitializedType, PersistedType> {
	static override get _defaults() {
		const defaults = super._defaults;

		return {
			...defaults,
			initial: 0,
			min: 0,
			max: 5,
			nullable: false,
			required: true,
			integer: true,
		};
	}

	/* -------------------------------------------- */
	//  Active Effect Integration
	/* -------------------------------------------- */

	override _applyChangeAdd(
		value: InitializedType,
		delta: InitializedType,
		model: DataModel.Any,
		change: ActiveEffect.ChangeData,
	): InitializedType {
		ExpertiseDieField.addSource(model, change);
		return super._applyChangeAdd(value, delta, model, change);
	}

	protected override _applyChangeSubtract(
		value: InitializedType,
		delta: InitializedType,
		model: DataModel.Any,
		change: ActiveEffect.ChangeData,
	): InitializedType {
		ExpertiseDieField.addSource(model, change);
		return super._applyChangeSubtract(value, delta, model, change);
	}

	protected override _applyChangeDowngrade(
		value: InitializedType,
		delta: InitializedType,
		model: DataModel.Any,
		change: ActiveEffect.ChangeData,
	): InitializedType {
		ExpertiseDieField.addSource(model, change);
		return super._applyChangeDowngrade(value, delta, model, change);
	}

	protected override _applyChangeMultiply(
		value: InitializedType,
		delta: InitializedType,
		model: DataModel.Any,
		change: ActiveEffect.ChangeData,
	): InitializedType {
		ExpertiseDieField.addSource(model, change);
		return super._applyChangeMultiply(value, delta, model, change);
	}

	protected override _applyChangeOverride(
		value: InitializedType,
		delta: InitializedType,
		model: DataModel.Any,
		change: ActiveEffect.ChangeData,
	): InitializedType | undefined {
		ExpertiseDieField.addSource(model, change);
		return super._applyChangeOverride(value, delta, model, change);
	}

	protected override _applyChangeUpgrade(
		value: InitializedType,
		delta: InitializedType,
		model: DataModel.Any,
		change: ActiveEffect.ChangeData,
	): InitializedType {
		ExpertiseDieField.addSource(model, change);
		return super._applyChangeUpgrade(value, delta, model, change);
	}

	/* -------------------------------------------- */
	//  Helpers
	/* -------------------------------------------- */
	static addSource(model: DataModel.Any, change: ActiveEffect.ChangeData) {
		const keyPath: string = change.key || '';

		const parentKey = keyPath.substring(0, keyPath.lastIndexOf('.'));
		const _defaults = { override: null, sources: [] as string[] };

		const roll: Record<string, any> = foundry.utils.getProperty(model, parentKey) ?? {};
		roll.expertiseDieSources ??= _defaults;

		if (roll?.expertiseDieSources?.override) return;

		// Get Data
		const value = Math.clamp(Number.parseInt(change.value as string, 10), 0, 5);
		const die = A5E.expertiseDiceSidesMap[value];
		if (!die) return;

		let inject = `d${die}`;
		if (change.type === 'multiply') inject = `${value}`;

		const source = `${change.effect?.name || ''} - ${inject}[${change.type.capitalize()}]`;

		if (change.type === 'override') roll.expertiseDieSources.override = source;
		else roll.expertiseDieSources.sources.push(source);
	}
}

export { ExpertiseDieField };
