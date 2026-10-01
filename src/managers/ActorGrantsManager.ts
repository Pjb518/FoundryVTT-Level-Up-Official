import fromUuidMulti from '#utils/fromUuidMulti.ts';
import prepareGrantsApplyData from '#utils/prepareGrantsApplyData.ts';
import prepareProficiencyConfigObject from '#utils/prepareProficiencyConfigObject.ts';
import prepareTraitGrantConfigObject from '#utils/prepareTraitGrantConfigObject.ts';
import GrantApplicationDialog from '#view/components/grants/GrantApplicationDialog.svelte';
import { GenericConfigDialog } from '#view/dialogs/initializers/GenericConfigDialog.svelte.ts';
import type {
	AppliedGrantTypes,
	Grant,
	GrantTypes,
} from '../dataModels/item/Grants/GrantsField.ts';

type GRANT_ITEM = Item.OfType<'feature'> | OriginItems;

interface DefaultApplyOptions {
	item: GRANT_ITEM;
	cls: Item.OfType<'class'> | null;
	charLevel?: number;
	clsLevel?: number;
	useUpdateSource?: boolean;
}

class ActorGrantsManager extends Map<string, Grant> {
	private actor: Character;

	#allowedTypes = new Set(['feature', 'archetype', 'background', 'class', 'culture', 'heritage']);

	grantedFeatureDocuments = new Map<string, string[]>();

	constructor(actor: Character) {
		super();
		this.actor = actor;

		[...this.actor.items].forEach((item) => {
			if (!this.#allowedTypes.has(item.type)) return;
			if (!item.system.grants) return;

			Object.values(item.system.grants ?? {}).forEach((grant) => {
				// Only add applied grants
				if (!grant.applied.isApplied) return;
				this.set(grant.fullId, grant);
			});
		});

		// Aggregate granted feature documents
		[...this.values()].forEach((grant) => {
			if (grant.type !== 'feature') return;

			const { documentIds } = grant.applied;
			documentIds.forEach((id) => {
				if (!this.grantedFeatureDocuments.has(id)) {
					this.grantedFeatureDocuments.set(id, []);
				}

				this.grantedFeatureDocuments.get(id)?.push(grant.fullId);
			});
		});
	}

	/** ================================================================= */
	// Getters
	/** ================================================================= */

	/** ================================================================= */
	// Helpers
	/** ================================================================= */

	/** Returns all grants filtered by their applied type */
	byAppliedType(type: AppliedGrantTypes): Grant[] {
		return [...this.values()].filter((grant) => grant.applied.grantType === type);
	}

	/** Returns all grants filtered by type */
	byType<T extends GrantTypes>(type: T): Grant<T>[] {
		return [...this.values()].filter((grant): grant is Grant<T> => grant.type === type);
	}

	// *************************************************************
	// Data Retrieval Methods
	// *************************************************************
	/** TODO - Needs fixing */
	getGrantedTraits(type: string): Record<string, any> {
		const grants = this.byAppliedType('trait');

		return grants.reduce((acc, grant) => {
			// @ts-expect-error
			if (grant.traitData.traitType !== type) return acc;

			// @ts-expect-error
			acc[grant.grantId] = {
				// @ts-expect-error
				itemId: grant.itemUuid,
				// @ts-expect-error
				traits: grant.traitData.traits,
			};

			return acc;
		}, {});
	}

	// *************************************************************
	// Update Methods
	// *************************************************************
	async createInitialGrants(item: GRANT_ITEM, isPreCreate = false): Promise<void> {
		if (!item) return;
		if (!this.#allowedTypes.has(item.type)) return;

		const applicableGrants: Grant[] = [];
		const optionalGrants: Grant[] = [];

		const classes = Object.keys(this.actor.levels.classes);
		const characterLevel: number = classes.length
			? this.actor.levels.character + 1
			: this.actor.levels.character;

		let itemSlug: string;

		if (item.isType('class')) itemSlug = item.slug;
		else if (item.isType('archetype')) itemSlug = item.system.class;
		else itemSlug = item.system.classes?.slugify({ strict: true }) || '';

		const classLevel: number = (this.actor.levels.classes?.[itemSlug] ?? 0) + 1;

		const grants: Grant[] = [...item.grants.values()];
		grants.forEach((grant) => {
			grant.grantedBy = { id: '', selectionId: '' };
		});

		// Get all applicable grants
		const subGrants: Grant[] = (
			await Promise.all(grants.map((grant) => this.#getSubGrants(grant, characterLevel)))
		)
			.flat()
			.filter((g) => !!g);

		const allGrants = grants.concat(subGrants);

		allGrants.forEach((grant) => {
			if (this.has(grant.fullId)) return;

			const { levelType } = grant;

			if (levelType === 'character') {
				if (grant.level > characterLevel) return;
				if (item.type === 'class') {
					let parentGrant: Grant | undefined = grant;

					while (true) {
						parentGrant = allGrants.find((g) => g.id === parentGrant?.grantedBy?.id);
						if (!parentGrant || parentGrant.levelType === 'class') break;
					}

					if (!parentGrant && grant.level !== characterLevel) return;
				}
			}

			if (levelType === 'class' && grant.level > classLevel) return;

			if (grant.optional) optionalGrants.push(grant);
			applicableGrants.push(grant);
		});

		let cls: DefaultApplyOptions['cls'] = null;
		if (item.isType('class')) cls = item;
		else if (item.isType('archetype')) cls = this.actor?.classes?.[item.system.class] ?? null;

		await this.#applyGrants(applicableGrants, optionalGrants, {
			item,
			cls,
			charLevel: characterLevel,
			clsLevel: classLevel,
			useUpdateSource: isPreCreate,
		});
	}

	async createLeveledGrants(
		currentLevel: number = 0,
		newLevel: number = 0,
		cls: Item.OfType<'class'> | null = null,
	): Promise<boolean> {
		const difference = newLevel - currentLevel;
		const sign = Math.sign(difference);
		const characterLevel: number = this.actor.levels.character + difference;
		const clsLevel = (this.actor.levels.classes?.[cls?.slug || ''] ?? 1) + difference;

		if (sign === 0) return false;
		if (sign === -1) {
			const clsSlug = cls?.slug || '';
			if (clsLevel < 1) {
				await cls?.sheet?.close();
				cls?.delete();
				return true;
			}

			await this.removeGrantsByClassLevel(clsLevel, clsSlug);
			return await this.removeGrantsByLevel(characterLevel);
		}

		const applicableGrants: Grant[] = [];
		const optionalGrants: Grant[] = [];

		const items = this.actor.items.filter((item) =>
			this.#allowedTypes.has(item.type),
		) as GRANT_ITEM[];

		for await (const item of items) {
			let itemSlug: string;

			if (item.isType('class')) itemSlug = item.slug;
			else if (item.isType('archetype')) itemSlug = item.system.class;
			else itemSlug = item.system.classes?.slugify({ strict: true }) || '';

			let classLevel: number = this.actor.levels.classes?.[itemSlug] ?? 1;
			if (itemSlug === cls?.slug) classLevel += difference;

			const grants = [...item.grants.values()];
			grants.forEach((grant: Grant) => {
				grant.grantedBy = { id: '', selectionId: '' };
			});

			const subGrants: Grant[] = (
				await Promise.all(grants.map((grant) => this.#getSubGrants(grant, characterLevel)))
			)
				.flat()
				.filter((g) => !!g);

			const allGrants = grants.concat(subGrants);

			allGrants.forEach((grant: Grant) => {
				let reSelectable = false;

				if (grant.grantedBy?.id) {
					const parentGrant =
						item.grants.get(grant.grantedBy.id) ??
						applicableGrants.find((g) => g.id === grant.grantedBy?.id);

					reSelectable = this.#isReSelectable(parentGrant);
				}

				if (this.has(grant.fullId) && !reSelectable) return;
				const parentGrant = [...this.values()].find((g) => g.id === grant.grantedBy?.id);
				if (parentGrant && !reSelectable) return;

				const { levelType } = grant;

				if (levelType === 'character') {
					if (grant.level > characterLevel) return;
					if (item.type === 'class') {
						let classParentGrant: Grant | undefined = grant;

						while (true) {
							classParentGrant = allGrants.find((g) => g.id === classParentGrant?.grantedBy?.id);

							if (!classParentGrant || classParentGrant.levelType === 'class') break;
						}

						if (!classParentGrant && grant.level !== characterLevel) return;
					}
				}

				if (levelType === 'class' && grant.level > classLevel) return;

				if (applicableGrants.find((g) => g.fullId === grant.fullId)) return;

				const hasGrantedGrant = applicableGrants.find((g) => g.id === grant.grantedBy?.id);
				if (grant.grantedBy?.id && !hasGrantedGrant) return;

				if (grant.optional) {
					// Infer if the grant has been offered before
					const isCurrentLevel =
						levelType === 'class' ? grant.level === classLevel : grant.level === characterLevel;

					if (!isCurrentLevel && !grant.grantedBy?.id && !reSelectable) return;

					optionalGrants.push(grant);
				}

				applicableGrants.push(grant);
			});
		}

		const result = await this.#applyGrants(applicableGrants, optionalGrants, {
			cls,
			item: cls!,
			charLevel: characterLevel,
			clsLevel,
			useUpdateSource: false,
		});

		return result;
	}

	#isReSelectable(grant?: Grant): boolean {
		if (!grant) return false;
		if (grant.type !== 'feature') return false;
		grant = grant as Grant<'feature'>;

		const { features } = grant.config;
		return features.base
			.concat(features.options)
			.some((f) => !f.limitedReselection || f.selectionLimit > 1);
	}

	async #getSubGrants(grant: Grant, characterLevel: number): Promise<Grant[]> {
		if (grant.type !== 'feature') return [];
		if (grant.level > characterLevel) return [];
		grant = grant as Grant<'feature'>;

		const docIds: string[] = [...grant.config.features.base, ...grant.config.features.options].map(
			(f) => f.uuid,
		);

		let docs: any;
		try {
			docs = await fromUuidMulti(docIds, { parent: this.actor });
		} catch (e: any) {
			console.error(e);
			console.warn(`Possible causes: ${docIds.join(', ')}`);
			ui.notifications?.error(`Grant ${grant.name} has an invalid document reference.`);
			throw new Error(e);
		}

		docs = docs.filter((d: any) => {
			if (!d) {
				ui.notifications?.error(
					`Grant ${grant.name} on item ${d.name} has an invalid document reference.`,
				);

				console.warn(`Possible causes: ${docIds.join(', ')}`);
				return false;
			}

			return true;
		});

		const grants: Grant[] = docs.flatMap((doc) =>
			[...doc.grants.values()].map((g) => {
				const hasSelectionId = !!grant.config.features.options.length;

				g.grantedBy = {
					id: grant.id,
					selectionId: hasSelectionId ? doc._stats.compendiumSource : '',
				};

				return g;
			}),
		);

		const subGrants: Grant[] = (
			await Promise.all(grants.map((g) => this.#getSubGrants(g, characterLevel)))
		)
			.flat()
			.filter((g) => !!g);

		return grants.concat(subGrants);
	}

	async #applyGrants(
		allGrants: Grant[],
		optionalGrants: Grant[],
		options: DefaultApplyOptions,
	): Promise<boolean> {
		if (!allGrants.length && !options.cls) return false;

		const requiresConfig = [...allGrants].some((grant) => grant.requiresConfig());
		const isClass = options.cls && options.item.type === 'class';
		// @ts-expect-error Checking class and archetype data
		const hasSpellCasting = options.item?.system?.spellcasting?.ability?.options?.length;

		const requiresDialog = requiresConfig || !!optionalGrants.length || isClass || hasSpellCasting;

		let dialogData: {
			updateData: any;
			success: boolean;
			documentData: Map<string, ActorGrantsManager.DocumentData>;
			itemUpdateData: any[];
			clsReturnData: Record<string, any>;
		};

		if (!requiresDialog) {
			const grants = allGrants.map((grant) => ({ id: grant.id, grant }));
			const { updateData, documentData, itemUpdateData } = await prepareGrantsApplyData(
				this.actor,
				grants,
				new Map(),
			);

			dialogData = {
				success: true,
				updateData,
				documentData,
				itemUpdateData,
				clsReturnData: {},
			};
		} else {
			const dialog = new GenericConfigDialog(
				undefined,
				`${this.actor.name} - Apply Grants (${options.item?.name ?? options.cls?.name})`,
				GrantApplicationDialog,
				{
					actor: this.actor,
					allGrants,
					optionalGrantsProp: optionalGrants,
					...options,
				},
			);

			await dialog.render(true);
			dialogData = await dialog.promise;

			if (!dialogData?.success) {
				if (options?.item && options.useUpdateSource && !options.cls) options.item.delete();
				return false;
			}
		}

		// Create sub items
		if (dialogData.documentData.size) {
			for await (const [grantId, docData] of dialogData.documentData) {
				let docs = docData.docs ?? [];
				const itemType = docData.type;

				// Check if a feature has already been created
				let existingIds = new Set<string>();
				if (itemType === 'feature') {
					const preCreateIds = new Set<string>(docs.map((d) => d._id));
					const existing = this.actor.items.filter((i) => preCreateIds.has(i.id));
					existingIds = new Set<string>(existing.map((i) => i.id));

					docs = docs.filter((d) => !existingIds.has(d._id));
				}

				// Create documents for this grant
				try {
					const ids = (
						await this.actor.createEmbeddedDocuments('Item', docs, {
							keepId: itemType === 'feature',
							// @ts-expect-error
							noGrant: itemType === 'feature',
						})
					).map((i) => i.id);

					// Update items with document ids
					const [itemId, gId] = grantId.split('.');
					dialogData.itemUpdateData.push({
						_id: itemId,
						[`system.grants.${gId}.applied.documentIds`]: [...ids, ...existingIds],
					});
				} catch (err) {
					console.error(err);
					return false;
				}
			}
		}

		// Add archetype
		const archetypeUuid = dialogData.clsReturnData.archetype;
		if (archetypeUuid) {
			const archetype = (await Item.fromDropData({ uuid: archetypeUuid })) as Item<'archetype'>;
			if (archetype) {
				const archetypeData = archetype.toObject();
				// This is being awaited because we need it when applied data is set
				await this.actor.createEmbeddedDocuments('Item', [archetypeData]);
			}
		}

		// Update actor with grants data
		if (dialogData.updateData) await this.actor.update(dialogData.updateData);

		// Update applied data
		if (dialogData.itemUpdateData?.length) {
			// We need to merge all updates pertaining to an item into one update object
			const uniqueUpdates: Record<string, any> = {};

			dialogData.itemUpdateData.forEach(({ _id, ...u }) => {
				if (!_id) return;
				uniqueUpdates[_id] ??= {};
				uniqueUpdates[_id] = foundry.utils.mergeObject(uniqueUpdates[_id], u, {
					inplace: false,
				});
			});

			// We do a reduce here to pull out the originating item and apply update source to it
			// Because it doesn't exist on the actor yet
			const exists = this.actor.items.get(options.item.id!);
			const itemUpdateData = Object.entries(uniqueUpdates ?? {}).reduce((acc, [id, u]) => {
				if (id === options.item._id && !exists) {
					// Get Update Method
					const updateMethod = options.useUpdateSource
						? options.item.updateSource.bind(options.item)
						: options.item.update.bind(options.item);

					updateMethod(u);
					return acc;
				}

				acc.push({ _id: id, ...u });
				return acc;
			}, [] as any[]);

			await this.actor.updateEmbeddedDocuments('Item', itemUpdateData);
		}

		// Update class data if available
		if (options.cls && options.item?.type === 'class') {
			const { clsReturnData } = dialogData;
			const { leveledHpType, hpFormula, hpValue } = clsReturnData;

			let hp: number;
			if (leveledHpType === 'roll' && hpFormula) {
				const roll = await new Roll(hpFormula).roll();
				hp = roll.total;

				this.#createRolledHpCard(options.cls, roll);
			} else if (['custom', 'average'].includes(leveledHpType) && hpValue) {
				hp = hpValue;
			} else {
				hp =
					options.cls.system.classLevels === 1 && options.charLevel === 1
						? options.cls.system.hp.levels['1']
						: options.cls.averageHP;
			}

			const spellCastingAbility =
				clsReturnData.spellcastingAbility ||
				options.cls.system.spellcasting.ability.options[0] ||
				options.cls.system.spellcasting.ability.base;

			// TODO: Remove updateSource method
			const updateMethod = options.useUpdateSource
				? options.cls.updateSource.bind(options.cls)
				: options.cls.update.bind(options.cls);

			await updateMethod({
				[`system.hp.levels.${options.charLevel}`]: hp,
				// @ts-expect-error
				'system.spellcasting.ability.value': spellCastingAbility,
			});

			// Update actor spell data and spellbook
			if (spellCastingAbility !== 'none' && options.clsLevel === 1) {
				// Update default spellcasting
				// @ts-expect-error
				if (this.actor.system.classes.startingClass === options.item.slug) {
					this.actor.update({
						// @ts-expect-error
						'system.attributes.spellcasting': spellCastingAbility,
					});
				}

				// Create or Update Spellbooks
				const spellBook: Record<string, any> = {
					ability: spellCastingAbility,
					name: `${options.cls.name} Spell Book`,
					showSpellSlots: false,
				};

				const resourceType = options.cls?.casting?.resource || 'slots';
				if (resourceType === 'slots') spellBook.showSpellSlots = true;
				else if (resourceType === 'points') spellBook.showSpellPoints = true;
				else if (resourceType === 'inventions') spellBook.showSpellInventions = true;
				else if (resourceType === 'artifactCharges') spellBook.showArtifactCharges = true;
				else spellBook.showSpellSlots = true;

				if (Object.keys(this.actor?.classes ?? {}).length > 1) {
					// Create New SpellBook
					this.actor.spellBooks.add(spellBook);
				} else {
					// Update first spellbook
					const spellBookId = this.actor.spellBooks.first()?._id;
					this.actor.update({
						[`system.spellBooks.${spellBookId}`]: spellBook,
					});
				}
			}
		}

		// Update archetype data if available
		if (options.item?.isType('archetype')) {
			const archetype = options.item;

			const spellCastingAbility =
				dialogData.clsReturnData.spellcastingAbility ||
				archetype.system.spellcasting.ability.options[0] ||
				archetype.system.spellcasting.ability.base;

			const updateMethod = options.useUpdateSource
				? archetype.updateSource.bind(archetype)
				: archetype.update.bind(archetype);

			await updateMethod({
				// @ts-expect-error
				'system.spellcasting.ability.value': spellCastingAbility,
			});
		}

		return true;
	}

	#createRolledHpCard(cls: Item.OfType<'class'>, roll: any) {
		const title = `Hit Dice Roll - ${cls.name}`;
		const chatData = {
			author: game.user?.id,
			// @ts-expect-error
			speaker: ChatMessage.getSpeaker({ actor: this.actor }),
			sound: CONFIG.sounds.dice,
			rolls: [roll],
			flags: {
				a5e: {
					actorId: this.actor.uuid,
					img: this.actor.img,
					name: this.actor.name,
					title,
				},
			},
		};

		// @ts-expect-error
		ChatMessage.create(chatData);
	}

	async removeGrantsByItem(item: Item): Promise<void> {
		const updates: Record<string, any> = {};
		for (const [id, grant] of Object.entries(item.system.grants)) {
			foundry.utils.mergeObject(updates, this.#getRemoveUpdates(grant));
		}

		await this.actor.update(updates);
	}

	async removeGrantsByClassLevel(classLevel: number, slug: string): Promise<boolean> {
		const updates: Record<string, any> = {};
		const itemUpdates: any[] = [];

		for (const [, grant] of this) {
			const originItem = grant.item as Item.OfType<'feature'> | Item.OfType<'class'>;

			if (!originItem) continue;
			if (!['class', 'feature'].includes(originItem.type)) continue;

			// Skip if the grant is not from the origin class
			if (originItem.isType('class') && originItem.slug !== slug) continue;
			if (originItem.isType('feature') && originItem.system.classes !== slug) continue;

			if (grant.level > classLevel) {
				const initialValue = grant.schema.getInitialValue().applied;
				itemUpdates.push({
					_id: originItem.id,
					[`system.grants.${grant.id}.applied`]: initialValue,
				});

				foundry.utils.mergeObject(updates, this.#getRemoveUpdates(grant));
			}
		}

		try {
			await this.actor.update(updates);
			await this.actor.updateEmbeddedDocuments('Item', itemUpdates);
		} catch (err) {
			console.error(err);
			return false;
		}

		// Remove archetype
		const cls = this.actor.classes?.[slug];
		if (!cls) return true;

		if (classLevel > cls.system.archetypeLevel) return true;

		const { archetype } = cls;
		if (!archetype) return true;

		archetype.delete();
		return true;
	}

	async removeGrantsByLevel(level: number): Promise<boolean> {
		const updates: Record<string, any> = {};
		const itemUpdates: any[] = [];

		for (const [, grant] of this) {
			if (grant.level > level) {
				const initialValue = grant.schema.getInitialValue().applied;
				itemUpdates.push({
					_id: grant.item!.id,
					[`system.grants.${grant.id}.applied`]: initialValue,
				});

				foundry.utils.mergeObject(updates, this.#getRemoveUpdates(grant));
			}
		}

		try {
			await this.actor.update(updates);
			await this.actor.updateEmbeddedDocuments('Item', itemUpdates);
		} catch (err) {
			console.error(err);
			return false;
		}

		return true;
	}

	async removeGrant(grantId: string): Promise<void> {
		const grant = [...this.values()].find((g) => g.id === grantId);
		if (!grant) return;

		const updates: Record<string, any> = {
			...this.#getRemoveUpdates(grant),
		};

		await this.actor.update(updates);
	}

	async removeAll(): Promise<void> {
		const updates: Record<string, any> = {};
		const itemUpdates: any[] = [];

		for (const [, grant] of this) {
			const initialValue = grant.schema.getInitialValue().applied;
			itemUpdates.push({
				_id: grant.item!.id,
				[`system.grants.${grant.id}.applied`]: initialValue,
			});

			foundry.utils.mergeObject(updates, this.#getRemoveUpdates(grant));
		}

		await this.actor.update(updates);
		await this.actor.updateEmbeddedDocuments('Item', itemUpdates);
	}

	#getRemoveUpdates(grant: Grant): Record<string, any> {
		const updates: Record<string, any> = {};

		if (grant.applied.grantType === 'bonus') {
			grant = grant as Grant<'ability'>; // Using this as a stub for bonus
			if (grant.applied.bonusId) {
				updates[`system.bonuses.${grant.applied.bonusType}.${grant.applied.bonusId}`] = _del;
			}

			return updates;
		}

		if (grant.applied.grantType === 'exertion') {
			grant = grant as Grant<'exertion'>;
			if (grant.applied.exertionType === 'bonus') {
				updates[`system.bonuses.exertion.${grant.applied.bonusId}`] = _del;
			}

			return updates;
		}

		if (grant.applied.grantType === 'document') {
			grant = grant as Grant<'feature'>;

			const ids = [...grant.applied.documentIds];
			if (!ids?.length) return updates;

			// Validate ids to ensure they are not already deleted
			const deleteIds = this.actor.items.reduce((acc: string[], i) => {
				if (ids.includes(i.id)) acc.push(i.id);
				return acc;
			}, []);

			this.actor.deleteEmbeddedDocuments('Item', deleteIds);

			return updates;
		}

		if (grant.applied.grantType === 'proficiency') {
			grant = grant as Grant<'proficiency'>;
			const { selected } = grant.applied;

			const configObject = prepareProficiencyConfigObject();
			const updateProps: Record<string, string[]> = {};

			selected.forEach((value) => {
				if (!value.includes(':')) return;
				const parts = value.split(':');
				if (parts.length < 2) return;

				const [profType, val] = parts;
				if (profType === 'savingThrow') {
					if (val === 'death') updates['system.attributes.death.proficient'] = false;
					else if (val === 'concentration') {
						updates['system.attributes.concentration.proficient'] = false;
					} else updates[`system.abilities.${val}.save.proficient`] = false;
				} else if (profType === 'skill') {
					// @ts-expect-error
					if (grant.config.upgradeToExpertise) {
						updates[`system.skills.${val}.proficient`] = Math.max(
							(this.actor.system.skills[val]?.proficient ?? 0) - 1,
							0,
						);
					} else updates[`system.skills.${val}.proficient`] = 0;
				} else {
					updateProps[profType] ??= [];
					updateProps[profType].push(val);
				}
			});

			Object.entries(updateProps).forEach(([profType, values]) => {
				const propKey = configObject[profType].propertyKey;
				if (!propKey) return;

				const removals = new Set(values);
				const profs = new Set((foundry.utils.getProperty(this.actor, propKey) as string[]) ?? []);

				// @ts-expect-error
				updates[propKey] = [...profs.difference(removals)];
			});

			return updates;
		}

		if (grant.applied.grantType === 'settings') {
			grant = grant as Grant<'settings'>;

			const prevSettings = Object.entries(grant.applied.previous ?? {});

			prevSettings.forEach(([id, val]) => {
				if (val) updates[`flags.a5e.${id}`] = val;
			});

			return updates;
		}

		if (grant.applied.grantType === 'skillSpecialty') {
			grant = grant as Grant<'skillSpecialty'>;
			const { skill } = grant.applied;

			const existing: Set<string> = new Set(
				(foundry.utils.getProperty(this.actor, `system.skills.${skill}.specialties`) as string[]) ??
					[],
			);

			const removals: Set<string> = new Set(grant.applied.selected);

			// @ts-expect-error
			updates[`system.skills.${skill}.specialties`] = [...existing.difference(removals)];

			return updates;
		}

		if (grant.applied.grantType === 'trait') {
			grant = grant as Grant<'trait'>;
			const appliedData = grant.applied;

			const configObject = prepareTraitGrantConfigObject();
			const { propertyKey } = configObject[appliedData.traitType] ?? {};
			if (!propertyKey) return {};

			const removals: Set<string> = new Set(appliedData.selected);
			const traits = new Set(
				(foundry.utils.getProperty(this.actor, propertyKey) as string[]) ?? [],
			);

			if (appliedData.traitType === 'size') updates[propertyKey] = '';
			else if (appliedData.traitType === 'damageResistances') {
				const removals: Set<string> = new Set(appliedData.selected);

				if (grant.config.upgradeResist) {
					const immunities = new Set(
						(foundry.utils.getProperty(this.actor, 'system.traits.damageImmunities') as string[]) ??
							[],
					);
					const upgraded = new Set(grant.applied.upgraded);

					[...removals].forEach((val) => {
						if (!upgraded.has(val)) return;
						removals.delete(val);
						immunities.delete(val);
					});

					updates['system.traits.damageImmunities'] = [...immunities];
				}

				// @ts-expect-error
				updates[propertyKey] = [...traits.difference(removals)];

				// Other
			} else {
				// @ts-expect-error
				updates[propertyKey] = [...traits.difference(removals)];
			}

			return updates;
		}

		return updates;
	}
}

declare namespace ActorGrantsManager {
	type DocumentData = { docs: any[]; type: string };
}

export { ActorGrantsManager };
