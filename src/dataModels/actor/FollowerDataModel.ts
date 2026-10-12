import { migrationData } from '../common.ts';

import fields = foundry.data.fields;

const followerSchema = () => ({
	personality: new fields.HTMLField({ required: true, initial: '' }),
	quirk: new fields.HTMLField({ required: true, initial: '' }),
	motivation: new fields.HTMLField({ required: true, initial: '' }),
});

declare namespace A5EFollowerData {
	type Schema = DataSchema & ReturnType<typeof followerSchema> & ReturnType<typeof migrationData>;

	interface BaseData extends Record<string, any> {}
	interface DerivedData extends Record<string, any> {
		experienceType: (typeof CONFIG.A5E.FOLLOWER_EXPERIENCE_RANKS)[number];
	}
}

class A5EFollowerData extends foundry.abstract.TypeDataModel<
	A5EFollowerData.Schema,
	Actor.Implementation,
	A5EFollowerData.BaseData,
	A5EFollowerData.DerivedData
> {
	static override defineSchema(): A5EFollowerData.Schema {
		return {
			...migrationData(),
			...followerSchema(),
		};
	}

	override prepareDerivedData() {
		super.prepareDerivedData();

		const ranks = CONFIG.A5E.FOLLOWER_EXPERIENCE_RANKS;
		let rank = 0;
		for (const item of this.parent.items as Iterable<any>) {
			if (item.type !== 'followerFeature') continue;

			const tier = ranks.indexOf(item.system.experienceType);
			if (tier > rank) rank = tier;
		}

		this.experienceType = ranks[rank];
	}
}

export { A5EFollowerData };
