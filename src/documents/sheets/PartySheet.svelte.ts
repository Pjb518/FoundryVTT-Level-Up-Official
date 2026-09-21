import { SvelteApplicationMixin } from '#lib/ApplicationMixin/SvelteApplicationMixin.svelte.ts';
import { type PartySheetStoreData, partySheetStore } from '#stores/PartySheetStore.svelte.ts';
import PartySheetComponent from '#view/sheets/PartySheet.svelte';

class PartySheetA5E extends SvelteApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
	public party: Actor.OfType<'party'>;

	public tempSettings: PartySheetStoreData = $derived({});

	protected root = PartySheetComponent;

	constructor(actor: { document: Actor.OfType<'party'> }, options: any = {}) {
		super(
			// @ts-expect-error
			foundry.utils.mergeObject(options, {
				classes: ['a5e-sheet, a5e-sheet--party'],
				document: actor.document,
				position: { width: 700, height: 'auto' },
				window: { resizable: true },
			}),
		);

		// @ts-expect-error
		this.party = actor.document.isToken ? actor.document.parent?.actor : actor.document;

		partySheetStore[this.party.uuid!] ??= {};
		this.tempSettings = partySheetStore[this.party.uuid!];
	}

	static override DEFAULT_OPTIONS = {
		baseApplication: 'ActorSheet',
		classes: ['a5e-sheet', 'a5e-sheet--party'],
		position: { width: 700, height: 'auto' },
		window: { minimizable: true, resizable: true },
	};

	protected async _prepareContext() {
		return {
			party: this.party,
			sheet: this,
		};
	}

	async _onDropActor(event: DragEvent, actor: Creature) {
		if (!game.user.isGM) return null;
		if (!actor.isCreature()) return null;

		// Update member list
		const currentMembers = this.party.system.details.members;
		currentMembers.add(actor.uuid!);
		await this.party.update({
			// @ts-expect-error
			'system.details.members': currentMembers,
		});

		return actor;
	}

	async _onDropItem(event: DragEvent, item: Item) {
		if (!['object', 'spell'].includes(item.type)) return null;

		if (item.type === 'spell') {
			this.#onDropSpell(item);
			return;
		}

		return super._onDropItem(event, item);
	}

	async #onDropSpell(item: Item.OfType<'spell'>) {
		// Create Spell Scroll
		const spellLevel = item.system.level;

		const { attackBonus, cost, craftingComponent, saveDC, rarity } =
			CONFIG.A5E.scrollData[spellLevel];

		const scroll = {
			name: `Spell Scroll (${item.name})`,
			img: 'icons/sundries/scrolls/scroll-writing-brown-gold.webp',
			type: 'object',
			system: {
				actions: {},
				craftingComponents: craftingComponent,
				description: item.system.description,
				price: { value: cost.value, denomination: cost.denomination, special: '' },
				objectType: 'consumable',
				rarity,
			},
		};

		scroll.system.actions = [...item.actions.values()].reduce((actions, _action) => {
			const action = { ..._action };

			action.prompts = Object.entries(action?.prompts ?? {}).reduce(
				(prompts, [key, _prompt]: [string, any]): object => {
					const prompt = { ..._prompt };

					if (prompt.type === 'savingThrow') {
						prompt.saveDC.type = 'custom';
						prompt.saveDC.bonus = saveDC;
					}

					prompts[key] = prompt;

					return prompts;
				},
				{},
			);

			action.rolls = Object.entries(action?.rolls ?? {}).reduce(
				(rolls, [key, _roll]: [string, any]): object => {
					const roll = { ..._roll };

					if (roll.type === 'attack') {
						roll.ability = 'none';
						roll.bonus = attackBonus.toString(10);
					}

					if (roll.scaling) {
						delete roll.scaling;
					}

					rolls[key] = roll;

					return rolls;
				},
				{},
			);

			action.consumers = {
				[foundry.utils.randomID()]: {
					itemId: '',
					quantity: 1,
					type: 'quantity',
				},
			};

			actions[foundry.utils.randomID()] = action;
			return actions;
		}, {});

		const createdItem = (await this.actor.createEmbeddedDocuments('Item', [scroll]))?.[0];
		if (!createdItem) return;

		// Set itemId on consumer
		const updateData = {};
		Object.entries(createdItem.system.actions).forEach(([actionId, action]: [string, any]) => {
			Object.entries(action.consumers ?? {}).forEach(([consumerId]) => {
				updateData[`system.actions.${actionId}.consumers.${consumerId}.itemId`] = createdItem.id;
			});
		});

		createdItem.update(updateData);
		return;
	}

	async _onDropActiveEffect(event: DragEvent, effect: ActiveEffect) {
		const members = this.party.members;

		// @ts-expect-error
		return Promise.all(members.map((a) => effect.transferEffect(a)));
	}
}

declare namespace PartySheetA5E {}

export { PartySheetA5E };
