import type { BaseActorA5e } from '../documents/actor/base';
import type { BaseItemA5e } from '../documents/item/base';
import type ObjectItemA5e from '../documents/item/object';
import type OriginItemA5e from '../documents/item/origin';
import type FeatureItemA5e from '../documents/item/feature';
import type SpellItemA5e from '../documents/item/spell';

import { SvelteApplication } from '#runtime/svelte/application';
import { localize } from '#runtime/util/i18n';

import ActorDocument from './ActorDocument';

import ActorSheetTempSettingsStore from '../stores/ActorSheetTempSettingsStore';

import ActorSheetComponent from './sheets/ActorSheet.svelte';
import LimitedSheetComponent from './sheets/LimitedSheet.svelte';

import getDocumentSourceTooltip from '../utils/getDocumentSourceTooltip';

export default class ActorSheet extends SvelteApplication {
	public actor: BaseActorA5e;

	public declare options: any;

	public tempSettings: any;

	/**
	 * @inheritDoc
	 */
	constructor(actor: BaseActorA5e, options: any = {}) {
		options.svelte ??= {};

		if (
			[
				CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE,
				CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED,
				// @ts-expect-error
			].includes(actor.permission)
		) {
			options.classes = ['a5e-sheet', 'a5e-actor-sheet', 'a5e-actor-sheet--limited'];
			options.svelte.class = LimitedSheetComponent;
			options.width = 512;
			options.resizable = false;
		} else {
			options.svelte.class = ActorSheetComponent;
			options.width = 755;
			options.height = 706;
			options.resizable = true;
		}

		super(
			foundry.utils.mergeObject(options, {
				baseApplication: 'ActorSheet',
				// @ts-expect-error
				id: `actor-sheet-${actor.isToken ? actor.parent?.id : actor.id}`,
				title: actor.name,
				token: null,
				svelte: {
					props: {
						document: null,
					},
				},
			}),
		);

		// @ts-expect-error
		this.actor = actor.isToken ? actor.parent.actor : actor;

		this.options.svelte.props.document = new ActorDocument(this.actor, {
			delete: this.close.bind(this),
		});

		this.options.svelte.props.sheet = this;
		this.tempSettings = {};
		ActorSheetTempSettingsStore.subscribe((store) => {
			this.tempSettings = store;
		});

		this.position.subscribe((pos) => this.setPosition(pos, false));
	}

	/**
	 * Default Application options
	 *
	 * @returns {object} options - Application options.
	 * @see https://foundryvtt.com/api/interfaces/client.ApplicationOptions.html
	 */
	static get defaultOptions(): any {
		// @ts-expect-error
		return foundry.utils.mergeObject(super.defaultOptions, {
			baseApplication: 'ActorSheet',
			classes: ['a5e-sheet', 'a5e-actor-sheet'],
			minimizable: true,
			svelte: {
				target: document.body,
			},
			token: null,
		});
	}

	get document() {
		return this.actor;
	}

	get object() {
		return this.actor;
	}

	get token() {
		return this.options?.token || this.actor.token || null;
	}

	override setPosition(pos: any, propagate = true): any {
		if (!propagate) return this.position.get();
		return super.setPosition(pos);
	}

	_getHeaderButtons() {
		// @ts-expect-error
		const buttons: any[] = super._getHeaderButtons();

		const PERMS = {
			isGM: game.user?.isGM,
			isOwner: this.actor.isOwner,
			canConfigure: game.user?.can('TOKEN_CONFIGURE'),
			isPack: this.actor.pack,
		};

		if (PERMS.isGM || (PERMS.isOwner && PERMS.canConfigure)) {
			buttons.unshift({
				label: this.options.token ? 'Token' : 'Prototype Token',
				class: 'configure-token',
				icon: 'fas fa-user-circle',
				onclick: ({ event }) => this._onConfigureToken(event),
			});
		}

		if (!PERMS.isPack) {
			buttons.unshift({
				label: 'Sheet Configuration',
				class: 'configure-sheet',
				icon: 'fas fa-cog fa-fw',
				title: 'Configure Sheet',
				onclick: ({ event }) => this._onConfigureSheet(event),
			});
		}

		const warpGateActive = game.modules.get('warpgate')?.active;

		if (warpGateActive && !PERMS.isPack && (PERMS.isGM || (PERMS.isOwner && PERMS.canConfigure))) {
			const shouldAddRevert = (token) => {
				if (!(token instanceof TokenDocument)) return false;
				// @ts-expect-error
				const mutateStack = warpgate.mutationStack(token).stack;
				if (mutateStack.length === 0) return false;
				return true;
			};

			if (shouldAddRevert(this.token)) {
				buttons.unshift({
					label: 'Revert',
					class: 'revert-wrapgate',
					icon: 'fas fa-undo-alt',
					title: 'Revert',
					onclick: async ({ event }) => {
						const shouldShow = (shiftKey) => {
							const mode = game.settings.get('warpgate', 'revertButtonBehavior');
							const show = mode === 'menu' ? !shiftKey : shiftKey;
							return show;
						};

						const mutateStack = this.token?.actor?.getFlag('warpgate', 'mutate');

						let name;
						const showMenu = shouldShow(event.shiftKey);

						if (showMenu) {
							const warpButtons = mutateStack.map((mutation) => ({
								label: mutation.name,
								value: mutation.name,
							}));
							// @ts-expect-error
							name = await warpgate.buttonDialog(
								{ warpButtons, title: localize('warpgate.display.revertDialogTitle') },
								'column',
							);
							if (name === false) return;
						}

						// @ts-expect-error
						warpgate.revert(this.token);
						// @ts-expect-error
						this?.render(false);
					},
				});
			}
		}

		if (PERMS.isPack) {
			buttons.unshift({
				label: 'Import',
				class: 'import',
				icon: 'fas fa-download',
				onclick: ({ event }) => this._onImport(event),
			});
		}

		// Remove any duplicate buttons that made if in due to multiple calls to _getHeaderButtons
		const labels: Set<string> = new Set();
		const uniqueButtons: any[] = [];
		buttons.forEach(({ label }, idx) => {
			if (labels.has(label)) return;

			labels.add(label);
			uniqueButtons.push(buttons[idx]);
		});

		return uniqueButtons;
	}

	_onImport(event) {
		if (event) event.preventDefault();
		return (
			this.actor.collection
				// @ts-expect-error
				.importFromCompendium(this.actor.compendium, this.actor.id)
		);
	}

	_onConfigureToken(event) {
		console.log(event);
		if (event) event.preventDefault();
		if (this.token) return this.token.sheet.render(true);
		// @ts-expect-error TODO: Types - Look into why this is broken
		// eslint-disable-next-line new-cap
		return new CONFIG.Token.prototypeSheetClass(this.actor.prototypeToken).render(true);
	}

	_onConfigureSheet(event) {
		if (event) event.preventDefault();

		const sheetConfigDialog = new DocumentSheetConfig(this.actor, { top: this.position.top + 40 });
		sheetConfigDialog.render(true);
	}

	async _onDrop(event: DragEvent, options: Record<string, any> = {}) {
		const transferData = event.dataTransfer?.getData('text/plain');
		if (!transferData) return;

		const dragData = JSON.parse(transferData);
		Hooks.callAll('dropActorSheetData', this.actor, this, dragData);

		const currentTab = this.tempSettings[this.actor.uuid]?.currentTab;
		const currentSpellBook =
			this.tempSettings[this.actor.uuid]?.currentSpellBook ??
			Object.keys(this.actor?.system?.spellBooks)?.[0];

		if (currentTab !== 'inventory') {
			if (dragData?.actorId === this.actor?.id) return;
			if (dragData?.parentId === this.actor?.id) return;
		}

		if (currentSpellBook) options.spellBookId = currentSpellBook;

		const { uuid, type } = dragData;

		let document: foundry.abstract.Document.Any | null = null;
		if (type) {
			try {
				const cls = CONFIG[type]?.documentClass;
				document = await cls.fromDropData(dragData);
			} catch (e) {
				document = await fromUuid(uuid);
			}
		} else {
			document = await fromUuid(uuid);
		}

		if (!document) return;
		this._onDropDocument(document, options);
	}

	async _onDropDocument(document: any, options = {}) {
		if (document.documentName === 'Actor') this.#onDropActor(document);
		else if (document.documentName === 'Item') this.#onDropItem(document, options);
		else if (document.documentName === 'ActiveEffect') this.#onDropActiveEffect(document);
	}

	// eslint-disable-next-line no-unused-vars, no-empty-function, @typescript-eslint/no-unused-vars
	async #onDropActor(actor: typeof Actor) {
		//
	}

	async #onDropActiveEffect(effect: ActiveEffect) {
		this.actor.createEmbeddedDocuments('ActiveEffect', [effect]);
	}

	async #onDropItem(item: BaseItemA5e, options: Record<string, any> = {}) {
		if (item.isType('destiny')) this.#onDropDestiny(item as OriginItemA5e);
		else if (item.isType('object')) this.#onDropObject(item as ObjectItemA5e, options);
		else if (item.isType('spell')) this.#onDropSpell(item as SpellItemA5e, options);
		else this.actor.createEmbeddedDocuments('Item', [item]);
	}

	async #onDropDestiny(item: OriginItemA5e) {
		if (!item.isType('destiny')) return;

		if (this.actor.type !== 'character') {
			ui.notifications.warn('Destiny documents cannot be added to NPCs.');
			return;
		}

		await this.actor.setFlag('a5e', 'destinyFulfilled', false);

		const uuids = [item.system.sourceOfInspiration, item.system.inspirationFeature];

		const features = (await Promise.all(uuids.map((uuid) => fromUuid(uuid)))).filter(
			(f) => f,
		) as FeatureItemA5e[];

		await this.actor.createEmbeddedDocuments('Item', [item, ...features]);
	}

	async #onDropObject(item: ObjectItemA5e, options: Record<string, any>) {
		// Check if item is dropped is on the sheet already
		if (item?.parent?.id === this.actor.id) {
			item.updateContainer(options.containerUuid ?? '');
			return;
		}

		const i = item.toObject();
		i.system.containerId = options.containerUuid ?? '';
		(
			(await this.actor.createEmbeddedDocuments('Item', [i])) as ObjectItemA5e[]
		)?.[0]?.updateContainer(options.containerUuid ?? '');
	}

	async #onDropSpell(item: SpellItemA5e, options: Record<string, any>) {
		const currentTab = this.tempSettings[this.actor.uuid]?.currentTab;

		if (currentTab !== 'inventory') {
			const { spellBookId } = options;

			if (spellBookId) {
				const spellBook = this.actor.spellBooks.get(spellBookId);
				spellBook?.addSpell(item);
			} else {
				ui.notifications.error('No spell book detected.');
			}

			return;
		}

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
				price: cost,
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
					// @ts-expect-error
					itemId: '',
					quantity: 1,
					type: 'quantity',
				},
			};

			actions[foundry.utils.randomID()] = action;
			return actions;
		}, {});

		// @ts-expect-error
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
	}

	/** @inheritdoc */
	async close(options) {
		this.options.token = null;
		// @ts-expect-error
		return super.close(options);
	}

	async _render(force = false, options = {}) {
		// @ts-expect-error
		await super._render(force, options);

		// @ts-expect-error
		const sheet = this.element?.[0];
		if (!sheet) return;

		const sheetTitle = sheet.querySelector('.window-header .window-title');

		const existingIdLink = sheetTitle.querySelector('.document-id-link');
		if (existingIdLink) return;

		const documentID = this.token?.id ?? this.actor?.id;
		const documentUUID = this.token?.uuid ?? this.actor?.uuid;
		const documentSource = CONFIG.A5E.products[this.actor?.system?.source];

		if (documentSource?.abbreviation) {
			const sourceLink = document.createElement('a');
			sourceLink.classList.add('a5e-document-source-link');
			sourceLink.setAttribute('alt', documentSource?.title);
			sourceLink.dataset.tooltip = getDocumentSourceTooltip(documentSource);
			sourceLink.dataset.tooltipClass =
				'a5e-tooltip a5e-tooltip--dark a5e-tooltip--document-source';
			sourceLink.dataset.tooltipDirection = 'DOWN';
			sourceLink.innerHTML = `<i class="fa-solid fa-book-open"></i> ${documentSource?.abbreviation}`;
			sourceLink.href = documentSource?.url;
			sourceLink.target = '_blank';

			sheetTitle.append(sourceLink);
		}

		const idLink = document.createElement('a');
		idLink.classList.add('document-id-link');
		idLink.setAttribute('alt', 'Copy Document ID');
		idLink.dataset.tooltip = 'Copy Document ID';
		idLink.dataset.tooltipDirection = 'DOWN';
		idLink.innerHTML = '<i class="fa-solid fa-passport"></i>';

		idLink.addEventListener('click', (event) => {
			event.preventDefault();
			// @ts-expect-error
			game.clipboard.copyPlainText(documentID);
			ui.notifications.info(
				game.i18n.format('DOCUMENT.IdCopiedClipboard', {
					label: 'Actor',
					type: 'id',
					id: documentID,
				}),
			);
		});

		idLink.addEventListener('contextmenu', (event) => {
			event.preventDefault();
			// @ts-expect-error
			game.clipboard.copyPlainText(documentUUID);
			ui.notifications.info(
				game.i18n.format('DOCUMENT.IdCopiedClipboard', {
					label: 'Actor',
					type: 'uuid',
					id: documentUUID,
				}),
			);
		});

		sheetTitle.append(idLink);
	}
}
