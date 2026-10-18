import { migrationData } from '../common.ts';
import { abilities, attributes, currency, traits } from './common.ts';

import fields = foundry.data.fields;

const distanceField = (initialUnit: string) =>
	new fields.SchemaField({
		distance: new fields.NumberField({
			required: true,
			nullable: false,
			initial: 0,
			integer: true,
			min: 0,
		}),
		unit: new fields.StringField({ required: true, initial: initialUnit }),
	});

const counterField = (initialMax: number) =>
	new fields.SchemaField({
		value: new fields.NumberField({
			required: true,
			nullable: false,
			initial: 0,
			integer: true,
			min: 0,
		}),
		max: new fields.NumberField({
			required: true,
			nullable: false,
			initial: initialMax,
			integer: true,
			min: 0,
		}),
	});

const vehicleSchema = () => {
	const { hp, prof } = attributes();

	return {
		attributes: new fields.SchemaField({
			ac: new fields.SchemaField({
				baseFormula: new fields.StringField({ required: true, initial: '10' }),
				value: new fields.NumberField({ required: true, initial: 0, integer: true }),
				addDriverDex: new fields.BooleanField({ required: true, initial: false }),
			}),
			hp,
			movement: new fields.SchemaField({
				walk: distanceField('feet'),
				journey: distanceField('miles'),
				impulse: new fields.StringField({
					required: true,
					nullable: false,
					initial: 'average',
					choices: ['slow', 'average', 'fast'],
				}),
			}),
			prof,
		}),
		details: new fields.SchemaField({
			terrain: new fields.StringField({
				required: true,
				nullable: false,
				initial: 'land',
				choices: Object.keys(CONFIG.A5E.vehicleTypes),
			}),
			specialProperties: new fields.ArrayField(
				new fields.StringField({ required: true, initial: '' }),
				{ required: true, initial: [] },
			),
			cost: new fields.SchemaField({
				value: new fields.NumberField({ required: true, nullable: false, initial: 0, min: 0 }),
				denomination: new fields.StringField({ required: true, initial: 'gp' }),
			}),
		}),
		weight: new fields.NumberField({ required: true, nullable: false, initial: 0, min: 0 }),
		capacity: new fields.SchemaField({
			supply: new fields.NumberField({ required: true, nullable: true, initial: null, min: 0 }),
			bulky: new fields.NumberField({ required: true, nullable: true, initial: null, min: 0 }),
			carry: new fields.NumberField({ required: true, nullable: true, initial: null, min: 0 }),
		}),
		collisionFormula: new fields.StringField({ required: true, initial: '' }),
		crew: counterField(0),
		passengers: counterField(0),
		momentum: new fields.BooleanField({ required: true, initial: false }),
		driver: new fields.DocumentUUIDField({ required: true, nullable: true, initial: null }),
		supply: new fields.NumberField({
			required: true,
			nullable: false,
			initial: 0,
			integer: true,
			min: 0,
		}),
	};
};

declare namespace A5EVehicleData {
	type Schema = DataSchema &
		ReturnType<typeof abilities> &
		ReturnType<typeof currency> &
		ReturnType<typeof traits> &
		ReturnType<typeof vehicleSchema> &
		ReturnType<typeof migrationData>;

	interface BaseData extends Record<string, any> {}
	interface DerivedData extends Record<string, any> {}
}

class A5EVehicleData extends foundry.abstract.TypeDataModel<
	A5EVehicleData.Schema,
	Actor.Implementation,
	A5EVehicleData.BaseData,
	A5EVehicleData.DerivedData
> {
	static override defineSchema(): A5EVehicleData.Schema {
		return {
			...abilities(),
			...currency(),
			...traits(),
			...migrationData(),
			...vehicleSchema(),
		};
	}

	override prepareBaseData() {
		super.prepareBaseData();

		this.attributes.prof = 0;
	}
}

export { A5EVehicleData };
