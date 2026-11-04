import { MigrationBase } from '../MigrationBase.ts';

export class Migration027MigrateResources extends MigrationBase {
	static override version = 0.027;

	override async updateActor(source: Actor): Promise<void> {
		// Update Existing Resources on actors to the new schema
		if (!['character', 'npc'].includes(source.type)) return;
		// @ts-expect-error
		source = source as unknown as Creature;

		const newResources = {} as Record<string, any>;
		const resources = source.system.resources ?? {};
		const classResources = foundry.utils.deepClone(resources.classResources ?? {});

		// delete resources.classResources;

		Object.entries(resources).forEach(([slug, resource]) => {
			// Delete class resources
			if (slug === 'classResources' && 'game' in globalThis) {
				newResources[slug] = _del;
			}

			// Return if neither value nor max is set and resource is not a counter
			// @ts-expect-error
			if (!resource.max.length && !resource.value && !resource.hideMax) {
				if ('game' in globalThis) newResources[slug] = _del;
				return;
			}

			let newResource: any;

			// Add Resource as counter if hideMax was set
			// @ts-expect-error
			if (resource.hideMax) {
				resource = resource as Resource<'counter'>;

				newResource = {
					// @ts-expect-error
					name: resource.label,
					value: resource.value,
					slug,
					per: resource.per,
					type: 'counter',
				};
			} else {
				// Set all other resources as uses
				resource = resource as Resource<'uses'>;
				newResource = {
					// @ts-expect-error
					name: resource.label,
					max: resource.max,
					value: resource.value,
					slug,
					per: resource.per,
					type: 'uses',
				};
			}

			if ('game' in globalThis) newResources[slug] = _replace(newResource);
			else newResources[slug] = _replace(newResource);
		});

		// Add classResources as resources
		Object.entries(classResources).forEach(([slug, value]: [string, number]) => {
			if (slug.startsWith('@')) {
				if ('game' in globalThis) newResources[slug] = _del;
				return;
			}

			newResources[slug] = {
				name: '',
				slug,
				value,
				max: '',
				per: '',
				type: 'uses',
			};
		});

		foundry.utils.setProperty(source, 'system.resources', newResources);

		// Migrate bonuses
		Object.entries(source.system.bonuses ?? {}).forEach(([key, bonuses]) => {
			if (typeof bonuses !== 'object') return;

			Object.entries(bonuses ?? {}).forEach(([bonusId, bonus]) => {
				if (!bonus.formula) return;
				foundry.utils.setProperty(
					source.system,
					`bonuses.${key}.${bonusId}.formula`,
					this.#replaceFormula(bonus.formula),
				);
			});
		});
	}

	override async updateItem(source: Item, parent?: any): Promise<void> {
		if (source.system.actions) {
			// @ts-expect-error
			this.#updateActionItem(source);
		}

		if (source.system.grants) {
			// @ts-expect-error
			this.#updateGrantItem(source);
		}

		// Update archetypes & classes
		if (['archetype', 'class'].includes(source.type)) {
			// @ts-expect-error
			this.#updateOriginItem(source, parent);
		}
	}

	#updateActionItem(item: ActionItem) {
		// Update AC Data
		// @ts-expect-error
		const ac = item.system.ac;
		if (ac) {
			foundry.utils.setProperty(
				item,
				'system.ac.baseFormula',
				this.#replaceFormula(ac?.baseFormula),
			);
			foundry.utils.setProperty(item, 'system.ac.formula', this.#replaceFormula(ac?.formula));
		}

		Object.entries(item.system.actions ?? {}).forEach(([actionId, action]) => {
			// Update consumers
			Object.entries(action.consumers ?? {}).forEach(([consumerId, consumer]) => {
				if (consumer.type !== 'resource') return;

				// @ts-expect-error Removed
				const slug = consumer.classIdentifier?.replaceAll('@classResources', '');

				const newConsumer = {
					default: consumer.default,
					label: consumer.label,
					id: consumer.id,
					resource: consumer.resource,
					resourceSlug: slug,
					quantity: consumer.quantity,
					type: 'resource',
				};

				foundry.utils.setProperty(
					item.system,
					`actions.${actionId}.consumers.${consumerId}`,
					newConsumer,
				);
			});

			// Update damage, healing, and generic roll formulas
			Object.entries(action.rolls ?? {}).forEach(([rollId, roll]) => {
				if (roll.type === 'damage' || roll.type === 'healing' || roll.type === 'generic') {
					const updated = this.#replaceFormula(roll.formula);

					foundry.utils.setProperty(
						item.system,
						`actions.${actionId}.rolls.${rollId}.formula`,
						updated,
					);
				}
			});
		});
	}

	#updateGrantItem(item: Item.OfType<'feature'>) {
		Object.entries(item.system.grants ?? {}).forEach(([grantId, grant]) => {
			// @ts-expect-error
			if (!grant.config?.bonus) return;

			// Update bonus
			foundry.utils.setProperty(
				item,
				`system.grants.${grantId}.bonus`,
				// @ts-expect-error
				this.#replaceFormula(grant.config.bonus),
			);
		});
	}

	#updateOriginItem(item: Item.OfType<'class'> | Item.OfType<'archetype'>, actor: Character) {
		(item.system.resources ?? []).forEach((resource) => {
			const reference = Object.entries(resource?.reference ?? {}).reduce((acc, [key, val], idx) => {
				const level = Number.parseInt(key, 10);
				// Return if the previous value is equal to the current value
				if (idx !== 0 && resource?.reference?.[level - 1] === val) return acc;

				acc.push({ max: val, level, per: resource.recovery });
				return acc;
			}, [] as any[]);

			const grant = {
				name: resource.name,
				config: {
					slug: resource.slug,
					reference,
					type: 'uses',
				},
				applied: {
					isApplied: true,
					grantType: 'resource',
					slug: resource.slug || resource.name?.slugify?.({ strict: true }) || '',
					level: 1,
				},
				levelType: 'class',
				type: 'resource',
				grantType: 'resource',
			};

			const id = foundry.utils.randomID();
			foundry.utils.setProperty(item, `system.grants.${id}`, grant);
		});
	}

	#replaceFormula(formula: string) {
		if (!formula) return '';
		let updated = formula.replaceAll('@classResources', '@resource');
		updated = updated.replaceAll('system.resources', 'resource');

		return updated;
	}
}
