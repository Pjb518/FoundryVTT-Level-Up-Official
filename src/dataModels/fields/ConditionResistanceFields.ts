const { fields } = foundry.data;

export const conditionResistanceValueFields = () => ({
	rollMode: new fields.NumberField({
		required: true,
		nullable: false,
		integer: true,
		initial: 0,
		choices: [-1, 0, 1],
	}),
	expertiseDice: new fields.NumberField({
		required: true,
		nullable: false,
		integer: true,
		initial: 0,
		min: 0,
		max: 6,
	}),
	bonus: new fields.NumberField({
		required: true,
		nullable: false,
		integer: true,
		initial: 0,
	}),
});
