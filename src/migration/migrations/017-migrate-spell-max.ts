import MigrationBase from '../MigrationBase';

export default class Migration017MigrateSpellMax extends MigrationBase {
	static version = 0.017;

	async updateActor(actor: Record<string, any>) {
		if (actor.type !== 'character') return;

		const spellResources = actor.system.spellResources ?? {};

		Object.entries(spellResources.slots ?? {}).forEach(([level, slots]: [string, any]) => {
			foundry.utils.setProperty(
				actor,
				`system.spellResources.slots.${level}.override`,
				slots.max ?? 0,
			);

			foundry.utils.setProperty(actor, `system.spellResources.slots.${level}.max`, 0);
		});

		foundry.utils.setProperty(
			actor,
			'system.spellResources.points.override',
			spellResources.points?.max ?? 0,
		);

		foundry.utils.setProperty(actor, 'system.spellResources.points.max', 0);
	}
}
