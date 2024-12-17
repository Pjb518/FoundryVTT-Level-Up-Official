/* eslint-disable max-classes-per-file */
const { fields } = foundry.data;

// ======================================================
//                        Schemas
// ======================================================
const baseSchema = () => ({
	quantity: new fields.NumberField({ required: true, nullable: false, initial: 1 }),
	scaling: new fields.ObjectField({ required: true, nullable: false }), // TODO: Actions
	placeTemplate: new fields.BooleanField({ required: true, nullable: false, initial: true }),

	default: new fields.BooleanField({ required: true, nullable: false, initial: true }),
	label: new fields.StringField({ required: true, nullable: false, initial: '' }),
	shape: new fields.StringField({ required: true, nullable: false, initial: '' }),
});

const circleAreaSchema = () => ({
	radius: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	...baseSchema(),
});

const coneAreaSchema = () => ({
	length: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	...baseSchema(),
});

const cubeAreaSchema = () => ({
	width: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	...baseSchema(),
});

const cylinderAreaSchema = () => ({
	radius: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	height: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	...baseSchema(),
});

const emanationAreaSchema = () => ({
	radius: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	...baseSchema(),
});

const lineAreaSchema = () => ({
	length: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	width: new fields.NumberField({ required: true, nullable: false, initial: 5 }),
	...baseSchema(),
});

const sphereAreaSchema = () => ({
	radius: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	...baseSchema(),
});

const squareAreaSchema = () => ({
	width: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	...baseSchema(),
});

const wallAreaSchema = () => ({
	height: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	length: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	width: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
	...baseSchema(),
});

// ======================================================
//                      NameSpaces
// ======================================================
declare namespace CircleAreaData {
	type Schema = DataSchema & ReturnType<typeof circleAreaSchema>;
}

declare namespace ConeAreaData {
	type Schema = DataSchema & ReturnType<typeof coneAreaSchema>;
}

declare namespace CubeAreaData {
	type Schema = DataSchema & ReturnType<typeof cubeAreaSchema>;
}

declare namespace CylinderAreaData {
	type Schema = DataSchema & ReturnType<typeof cylinderAreaSchema>;
}

declare namespace EmanationAreaData {
	type Schema = DataSchema & ReturnType<typeof emanationAreaSchema>;
}

declare namespace LineAreaData {
	type Schema = DataSchema & ReturnType<typeof lineAreaSchema>;
}

declare namespace SphereAreaData {
	type Schema = DataSchema & ReturnType<typeof sphereAreaSchema>;
}

declare namespace SquareAreaData {
	type Schema = DataSchema & ReturnType<typeof squareAreaSchema>;
}

declare namespace WallAreaData {
	type Schema = DataSchema & ReturnType<typeof wallAreaSchema>;
}

// ======================================================
//                       Classes
// ======================================================
class CircleAreaData extends foundry.abstract.DataModel<
	CircleAreaData.Schema,
	foundry.abstract.Document<DataSchema, any, any>
> {
	static override defineSchema(): CircleAreaData.Schema {
		return {
			...circleAreaSchema(),
		};
	}
}

class ConeAreaData extends foundry.abstract.DataModel<
	ConeAreaData.Schema,
	foundry.abstract.Document<DataSchema, any, any>
> {
	static override defineSchema(): ConeAreaData.Schema {
		return {
			...coneAreaSchema(),
		};
	}
}

class CubeAreaData extends foundry.abstract.DataModel<
	CubeAreaData.Schema,
	foundry.abstract.Document<DataSchema, any, any>
> {
	static override defineSchema(): CubeAreaData.Schema {
		return {
			...cubeAreaSchema(),
		};
	}
}

class CylinderAreaData extends foundry.abstract.DataModel<
	CylinderAreaData.Schema,
	foundry.abstract.Document<DataSchema, any, any>
> {
	static override defineSchema(): CylinderAreaData.Schema {
		return {
			...cylinderAreaSchema(),
		};
	}
}

class EmanationAreaData extends foundry.abstract.DataModel<
	EmanationAreaData.Schema,
	foundry.abstract.Document<DataSchema, any, any>
> {
	static override defineSchema(): EmanationAreaData.Schema {
		return {
			...emanationAreaSchema(),
		};
	}
}

class LineAreaData extends foundry.abstract.DataModel<
	LineAreaData.Schema,
	foundry.abstract.Document<DataSchema, any, any>
> {
	static override defineSchema(): LineAreaData.Schema {
		return {
			...lineAreaSchema(),
		};
	}
}

class SphereAreaData extends foundry.abstract.DataModel<
	SphereAreaData.Schema,
	foundry.abstract.Document<DataSchema, any, any>
> {
	static override defineSchema(): SphereAreaData.Schema {
		return {
			...sphereAreaSchema(),
		};
	}
}

class SquareAreaData extends foundry.abstract.DataModel<
	SquareAreaData.Schema,
	foundry.abstract.Document<DataSchema, any, any>
> {
	static override defineSchema(): SquareAreaData.Schema {
		return {
			...squareAreaSchema(),
		};
	}
}

class WallAreaData extends foundry.abstract.DataModel<
	SquareAreaData.Schema,
	foundry.abstract.Document<DataSchema, any, any>
> {
	static override defineSchema(): WallAreaData.Schema {
		return {
			...wallAreaSchema(),
		};
	}
}

export {
	CircleAreaData,
	ConeAreaData,
	CubeAreaData,
	CylinderAreaData,
	EmanationAreaData,
	LineAreaData,
	SphereAreaData,
	SquareAreaData,
	WallAreaData,
};
