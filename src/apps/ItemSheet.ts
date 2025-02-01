import type { BaseItemA5e } from '../documents/item/base';

import { SvelteApplication } from '#runtime/svelte/application';

import ItemDocument from './ItemDocument';

import ArchetypeSheetComponent from './sheets/ArchetypeSheet.svelte';
import BackgroundSheetComponent from './sheets/BackgroundSheet.svelte';
import ClassSheetComponent from './sheets/ClassSheet.svelte';
import CultureSheetComponent from './sheets/CultureSheet.svelte';
import DestinySheetComponent from './sheets/DestinySheet.svelte';
import HeritageSheetComponent from './sheets/HeritageSheet.svelte';
import ItemSheetComponent from './sheets/ItemSheet.svelte';
import LimitedSheetComponent from './sheets/LimitedSheet.svelte';

import getDocumentSourceTooltip from '../utils/getDocumentSourceTooltip';
import type { ItemA5e } from '../documents/item/item';
import type FeatureItemA5e from '../documents/item/feature';
import type SpellItemA5e from '../documents/item/spell';

export default class ItemSheet extends SvelteApplication {
	public item: BaseItemA5e;

	public declare options: any;

	/**
	 * @inheritDoc
	 */
	constructor(item, options: any = {}) {
		options.svelte ??= {};

		if (
			[CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE, CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED].includes(
				item.permission,
			)
		) {
			options.classes = ['a5e-sheet', 'a5e-sheet--item', 'a5e-actor-sheet--limited'];
			options.svelte.class = LimitedSheetComponent;
			options.width = 512;
			options.resizable = false;
		} else {
			options.svelte.class = ItemSheet.getSheetComponent(item.type);
			options.classes = ['a5e-sheet', 'a5e-sheet--item'];
			options.width = 555;
			options.height = 592;
			options.resizable = true;
		}

		// eslint-disable-next-line no-nested-ternary
		const parentId = item.parent
			? item?.parent?.isToken
				? (item?.parent?.parent.id ?? item.parent.id)
				: item.parent.id
			: null;

		super(
			foundry.utils.mergeObject(options, {
				baseApplication: 'ItemSheet',
				id: parentId ? `item-sheet-${parentId}-${item.id}` : `item-sheet-${item.id}`,
				classes: ['a5e-sheet', 'a5e-sheet--item'],
				title: item.name,
				focusAuto: item.type !== 'heritage',
				svelte: {
					props: {},
				},
			}),
		);

		this.item = item;

		this.options.svelte.props.document = new ItemDocument(
			this.item,
			// @ts-expect-error
			{ delete: this.close.bind(this) },
		);

		this.options.svelte.props.sheet = this;
	}

	/**
	 * Default Application options
	 *
	 * @returns {object} options - Application options.
	 * @see https://foundryvtt.com/api/Application.html#options
	 */
	static get defaultOptions(): any {
		// @ts-expect-error
		return foundry.utils.mergeObject(super.defaultOptions, {
			baseApplication: 'ItemSheet',
			classes: ['a5e-sheet', 'a5e-item-sheet'],
			minimizable: true,
			svelte: {
				target: document.body,
			},
		});
	}

	get object() {
		return this.item;
	}

	get document() {
		return this.item;
	}

	_getHeaderButtons() {
		// @ts-expect-error
		const buttons = super._getHeaderButtons();

		if (!this.item.pack) {
			buttons.unshift({
				label: 'Sheet Configuration',
				class: 'configure-sheet',
				icon: 'fas fa-cog fa-fw',
				title: 'Configure Sheet',
				onclick: ({ event }) => this._onConfigureSheet(event),
			});

			const { sourceId } = this.item;

			if (sourceId && this.item.uuid !== sourceId) {
				if (this.item.system.revitalizeLock) {
					buttons.unshift({
						icon: 'fa-solid fa-unlock',
						onclick: () => this.item.toggleRevitalizeLock(),
					});
				} else {
					buttons.unshift({
						icon: 'fa-solid fa-lock',
						onclick: () => this.item.toggleRevitalizeLock(),
					});
				}
				
				buttons.unshift({
					label: 'Revitalize',
					icon: 'fa-solid fa-arrows-rotate',
					onclick: () => this.item.revitalize(),
				});
			}
		}

		if (this.item.pack) {
			buttons.unshift({
				label: 'Import',
				class: 'import',
				icon: 'fas fa-download',
				onclick: ({ event }) => this._onImport(event),
			});
		}
		return buttons;
	}

	_onImport(event) {
		if (event) event.preventDefault();
		return (
			this.item.collection
				// @ts-expect-error
				.importFromCompendium(this.item.compendium, this.item.id)
		);
	}

	_onConfigureSheet(event) {
		if (event) event.preventDefault();

		const sheetConfigDialog = new DocumentSheetConfig(this.item, { top: this.position.top + 40 });
		sheetConfigDialog.render(true);
	}

	async _onDropDocument(dragData) {
		const types = ['archetype', 'background', 'class', 'culture', 'heritage'];
		if (types.includes(this.item.type)) {
			if (dragData.type === 'Grant') await this.#onDropGrant(dragData);
		} else {
			if (dragData.type === 'Action') await this.#onDropAction(dragData);
			if (dragData.type === 'Grant') await this.#onDropGrant(dragData);
			if (dragData.type === 'Item') await this.#onDropItem(dragData);
		}
	}

	async #onDropAction(dragData: any) {
		const { actionId, itemUuid } = dragData;
		if (!actionId || !itemUuid) return;

		const document = (await fromUuid(itemUuid)) as ItemA5e;
		const action = document?.actions.get(actionId)?.toObject();
		if (!action) return;

		// Change image
		// @ts-expect-error
		action.img = document?.img;

		// Copy over effects from old item to new item
		const effects = [...action.effects]
			.map((id) => document.effects.get(id)?.toObject())
			.filter((e) => !!e);

		if (effects.length) {
			const effectIds = (await this.item.createEmbeddedDocuments('ActiveEffect', effects)).map(
				(e) => e.id,
			);

			action.effects = effectIds;
		}

		(this.item as ItemA5e).actions.add(action);
	}

	async #onDropGrant(dragData: Record<string, any>) {
		const { grantId, itemUuid } = dragData;
		if (!grantId || !itemUuid) return;

		const document = (await fromUuid(itemUuid)) as FeatureItemA5e;
		const grant = foundry.utils.duplicate(document?.grants.get(grantId));
		if (!grant) return;

		// Change image
		// @ts-expect-error
		grant.img ??= document?.img;

		await (this.item as FeatureItemA5e).grants.add(grant);
	}

	async #onDropItem(dragData) {
		const { uuid } = dragData;
		const document = (await fromUuid(uuid)) as BaseItemA5e;
		if (!document) return;

		if (document.isType('spell')) this.#onDropSpell(document as SpellItemA5e);
	}

	async #onDropSpell(spell: SpellItemA5e) {
		// Get all actions from spell
		const actions = [...spell.actions.values()];

		// Create copies of all the actions.
		for await (const action of actions) {
			const actionData = action.toObject();

			// @ts-expect-error
			actionData.img = spell.img;
			actionData.description ??= spell.system.description;
			actionData.descriptionOutputs = ['action'];

			// Copy over effects from old item to new item
			const effects = [...actionData.effects]
				.map((id) => spell.effects.get(id)?.toObject())
				.filter((e) => !!e);

			if (effects.length) {
				const effectIds = (await this.item.createEmbeddedDocuments('ActiveEffect', effects)).map(
					(e) => e.id,
				);

				actionData.effects = effectIds;
			}

			// @ts-expect-error
			this.item.actions.add(actionData);
		}
	}

	static getSheetComponent(type) {
		if (type === 'archetype') return ArchetypeSheetComponent;
		if (type === 'background') return BackgroundSheetComponent;
		if (type === 'class') return ClassSheetComponent;
		if (type === 'culture') return CultureSheetComponent;
		if (type === 'destiny') return DestinySheetComponent;
		if (type === 'heritage') return HeritageSheetComponent;
		return ItemSheetComponent;
	}

	async _render(force = false, options = {}) {
		// @ts-expect-error
		await super._render(force, options);

		// @ts-expect-error
		const sheet = this.element[0];
		const sheetTitle = sheet.querySelector('.window-header .window-title');

		const existingIdLink = sheetTitle.querySelector('.document-id-link');
		if (existingIdLink) return;

		const documentID = this.item.id;
		const documentUUID = this.item.uuid;
		const documentSource = CONFIG.A5E.products[this.item?.system?.source];

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
		idLink.dataset.tooltipDirection = 'UP';
		idLink.innerHTML = '<i class="fa-solid fa-passport"></i>';

		idLink.addEventListener('click', (event) => {
			event.preventDefault();
			// @ts-expect-error
			game.clipboard.copyPlainText(documentID);
			ui.notifications.info(
				game.i18n.format('DOCUMENT.IdCopiedClipboard', {
					label: 'Item',
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
					label: 'Item',
					type: 'uuid',
					id: documentUUID,
				}),
			);
		});

		sheetTitle.append(idLink);
	}
}
