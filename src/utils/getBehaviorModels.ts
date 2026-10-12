export function getBehaviorModels() {
	const dataModels = { ...CONFIG.RegionBehavior.dataModels } as const;

	const typed = Object.entries(dataModels ?? {})
		.map(([type, cls]) => {
			let def: DataSchema;

			try {
				def = cls.defineSchema();
			} catch {
				return undefined;
			}

			const schema = {
				...def,
				name: new foundry.data.fields.StringField({
					required: true,
					nullable: false,
					initial: 'New Behavior',
				}),
				type: new foundry.data.fields.StringField({
					required: true,
					nullable: false,
					initial: type,
					blank: false,
				}),
			};

			return [type, schema];
		})
		.filter(Boolean);

	// @ts-expect-error
	return Object.fromEntries(typed);
}
