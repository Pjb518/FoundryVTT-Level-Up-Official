import * as AreaData from './ActionAreaDataModels.ts';

// ======================================================
//                       Areas
// ======================================================
const areaShapesMap = {
	circle: AreaData.CircleAreaData,
	cone: AreaData.ConeAreaData,
	cube: AreaData.CubeAreaData,
	cylinder: AreaData.CylinderAreaData,
	emanation: AreaData.EmanationAreaData,
	line: AreaData.LineAreaData,
	sphere: AreaData.SphereAreaData,
	square: AreaData.SquareAreaData,
	wall: AreaData.WallAreaData,
} as const;

declare namespace ActionAreaField {
	export type AreaShapesMap = typeof areaShapesMap;

	export type AreaShapes = keyof AreaShapesMap;
}

class ActionAreaField<
	const Options extends DataFieldOptions<object> = foundry.data.fields.ObjectField.DefaultOptions,
	const AreaType extends ActionAreaField.AreaShapes = ActionAreaField.AreaShapes,
	const AssignmentType = { type: AreaType },
	const InitializedType = ActionAreaField.AreaShapesMap[AreaType] & { type: AreaType },
	const PersistedType extends object | null | undefined = ActionAreaField.AreaShapesMap[AreaType],
> extends foundry.data.fields.ObjectField<Options, AssignmentType, InitializedType, PersistedType> {
	getModelForType(type: ActionAreaField.AreaShapes) {
		return areaShapesMap[type];
	}

	override _cleanType(
		value: InitializedType,
		options?: foundry.data.fields.DataField.CleanOptions,
		_state?,
	): InitializedType {
		if (!(typeof value === 'object')) value = {} as InitializedType;

		// @ts-expect-error
		const Cls = this.getModelForType(value?.type);
		// @ts-expect-error
		if (Cls) return Cls.cleanData(value, options, _state);
		return value;
	}

	override initialize(
		value: PersistedType,
		model: foundry.abstract.DataModel<DataSchema, any>,
		options = {},
	): InitializedType {
		// @ts-expect-error
		const Cls = this.getModelForType(value?.type);
		const schema = Cls?.schema;
		const filledValue = foundry.utils.mergeObject(schema?.getInitialValue() ?? {}, value);

		// @ts-expect-error
		if (Cls) return new Cls(filledValue, { parent: model, ...options });
		// @ts-expect-error
		return foundry.utils.deepClone(value);
	}
}

// ======================================================
//                      Exports
// ======================================================
export { ActionAreaField };
