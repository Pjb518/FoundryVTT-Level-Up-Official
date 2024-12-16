import type { BaseActorA5e } from '../documents/actor/base';
import type { BaseItemA5e } from '../documents/item/base';

declare namespace A5eEnricherManager {
	type EnricherTypes = 'check' | 'save' | 'condition';
}

class A5eEnricherManager {
	/**
	 * Pushes enrichers to config and adds
	 */
	registerCustomEnrichers() {
		CONFIG.TextEditor.enrichers.push({
			// [[/check args=d|"d"|'d']]
			pattern: /\[\[\/(?<enricherType>check|save|condition)(?<argString> [^\]]+)?]]/gi,
			enricher: this.parseEnricherInput.bind(this),
		});

		// CONFIG.TextEditor.enrichers.push({
		// pattern: new RegExp(`\\[\\[\\/(?<enricherType>${enricherTypes.join('|')})(?<argString>( +\\w+=([\\w\\d]+|"[\\w\\d ]+"))*)\\]\\]`, 'gi'),
		//   enricher: this.parseEnricherInput.bind(this)
		// }, {
		//   // eslint-disable-next-line no-useless-escape
		//   pattern: /\[\[\/choose label=((?<label>[\w\d]+)|"(?<label>[\w\d -\.,]+)")(?<argString>( +(\[\d+\])?(uuid|text)=([\d\w\-\.]+|"[\d\w\-\. ]+"))+) *\]\]/gi,
		//   enricher: this.parseChooseInput.bind(this)
		// });

		// FIXME: This is inefficient
		document.body.addEventListener('click', this.onRoll.bind(this));
		document.body.addEventListener('click', this.onEffect.bind(this));
		document.body.addEventListener('click', this.onChoose.bind(this));
	}

	/**
	 * Parse the enriched string and provide the appropriate content.
	 * @param match      The regular expression match result.
	 * @param options    Options provided to customize text enrichment. Unused
	 * @returns An HTML element to insert in place of the matched text or
	 *          null to indicate that no replacement should be made.
	 */
	async parseEnricherInput(
		match: RegExpMatchArray,
		options?: TextEditor.EnrichmentOptions,
	): Promise<HTMLElement | null> {
		const { enricherType, argString } = match.groups as { enricherType: string; argString: string };

		console.log(enricherType, argString);

		const args = this.#parseArguments(argString);
		args.enricherType = enricherType.toLowerCase();

		console.log(args);

		if (enricherType === 'check') return this.#enrichCheck(args, options);
		if (enricherType === 'save') return this.#enrichSave(args, options);
		if (enricherType === 'condition') return this.#enrichCondition(args, options);

		return null;
	}

	/* -------------------------------------------- */
	/*  Helpers                                     */
	/* -------------------------------------------- */

	/**
	 * Parses the arguments into record format and parses into int if possible.
	 * @param argString   The raw arguments string
	 * @returns An indexed array of config item tuples [arg, val]
	 */
	#parseArguments(argString: string): Record<string, any> {
		const expr = /(\w+)=(["']?)([^"'\s]+(?:\s[^"'\s]+)*?)\2/gi;
		const match = [...argString.matchAll(expr)];

		const args: Record<string, any> = {};

		match?.forEach((g) => {
			const key = g.at(1)?.toLowerCase();
			const value = g.at(3);

			if (!key || !value) return;

			args[key] = value;
		});

		return args;
	}

	/**
	 * Copies the entries of a record onto the dataset of an HTML element.
	 * @param element    HTML element to contain entries.
	 * @param args       Record of entries to be stored in element.
	 */
	#addToDataset(element: HTMLElement, args: Record<string, any>) {
		for (const [key, val] of Object.entries(args)) {
			if (val) element.dataset[key] = val as string;
		}
	}

	/**
	 * Creates a record containing the entries of an HTML element's dataset.
	 * If validOptions is provided, only copies records listed in validOptions
	 * and maps to mapped keys.
	 * @param element        HTML element containing entries.
	 * @param validOptions   Optional record of valid options and key mappings.
	 *                       Key is key to search for in dataset.
	 *                       Value is what key in destination to map value to.
	 * @returns A record containing entries from element dataset.
	 */
	#getOptions(
		element: HTMLElement,
		validOptions?: Record<string, { name: string; type: string }>,
	): Record<string, any> {
		const optionsRecord: Record<string, any> = {};

		Object.entries(element.dataset).forEach(([key, val]) => {
			if (!val) return;

			if (!validOptions) {
				optionsRecord[key] = val;
				return;
			}

			if (!(key in validOptions)) return;

			const { name, type } = validOptions[key];

			if (type === 'number') optionsRecord[name] = Number.parseInt(val, 10);
			else if (type === 'boolean') optionsRecord[name] = Boolean(val);
			else optionsRecord[name] = val;
		});

		return optionsRecord;
	}

	/* -------------------------------------------- */
	/*  Rolling Enrichers: Save + Check             */
	/* -------------------------------------------- */

	/**
	 * Provides basic argument validation for checks and provides replacement for the enriched text.
	 * @param args      Record of arguments passed in.
	 * @param options   Options provided to customize text enrichment. Unused
	 * @returns an HTML element to insert in place of the matched text null
	 *          to indicate that no replacement should be made.
	 */
	async #enrichCheck(
		args: Record<string, any>,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		options?: TextEditor.EnrichmentOptions,
	): Promise<HTMLElement | null> {
		let label = args.label || 'Check';
		const { ability, skill }: { ability?: string; skill?: string } = args;

		if (!skill && !ability) return this.createInvalidTag('No ability or skill provided.');

		// Check if the ability is proper
		if (ability && !Object.keys(CONFIG.A5E.abilities).includes(ability))
			return this.createInvalidTag(`Invalid ability: ${ability}.`);

		// Checks for a properly defined skill
		if (skill) {
			if (!Object.keys(CONFIG.A5E.skills).includes(skill))
				return this.createInvalidTag(`Invalid skill: ${skill}.`);

			// Skill check with or without default ability
			if (!args.label) label = `${CONFIG.A5E.skills[skill]} ${label}`;
			return this.#createRollButton(args, options, label);
		}

		if (!ability) return this.createInvalidTag('No ability provided.');

		if (!args.label) label = `${CONFIG.A5E.abilities[ability]} ${label}`;
		return this.#createRollButton(args, options, label);
	}

	/**
	 * Provides basic argument validation for saves and provides replacement for the enriched text.
	 * @param args      Record of arguments passed in.
	 * @param options   Options provided to customize text enrichment. Unused
	 * @returns An HTML element to insert in place of the matched text or
	 *          null to indicate that no replacement should be made.
	 */
	async #enrichSave(
		args: Record<string, any>,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		options?: TextEditor.EnrichmentOptions,
	): Promise<HTMLElement | null> {
		const saveTypes: string[] = ['death', 'concentration'];
		const { type, ability }: { type?: string; ability?: string } = args;
		let label = args.label || 'Saving Throw';

		if (!type && !ability) return this.createInvalidTag('No type or ability provided.');

		// Is either concentration or death save
		if (type) {
			if (!saveTypes.includes(type)) return this.createInvalidTag(`Invalid save type ${type}.`);

			if (!args.label) label = `${args.type.capitalize()} ${label}`;
			return this.#createRollButton(args, options, label);
		}

		// Check if the ability is proper
		if (!ability) return this.createInvalidTag('No ability provided.');

		if (ability && !Object.keys(CONFIG.A5E.abilities).includes(ability)) {
			return this.createInvalidTag(`Invalid ability: ${ability}.`);
		}

		if (!args.label) label = `${CONFIG.A5E.abilities[ability]} ${label}`;
		return this.#createRollButton(args, options, label);
	}

	/* -------------------------------------------- */
	/*  Button Generators                           */
	/* -------------------------------------------- */

	/**
	 * Creates a roll button to replace enriched text.
	 * @param args    Record of arguments passed in and stored in element.
	 * @param options Text editor options
	 * @param label   The label for the output button
	 * @returns An HTML element to insert in place of the matched text or
	 *          null to indicate that no replacement should be made.
	 */
	async #createRollButton(
		args: Record<string, any>,
		options: TextEditor.EnrichmentOptions | undefined,
		label: string,
	): Promise<HTMLElement | null> {
		const span = document.createElement('span');
		span.classList.add('a5e-enricher');
		span.classList.add('a5e-enricher--roll');

		// TODO: Maybe update this
		this.#addToDataset(span, args);

		let dc: number | null = null;
		// @ts-expect-error
		if (args.dc) dc = (await new Roll(args.dc, options.rollData).evaluate()).total;
		const showDC = (game.user?.isGM || options?.secrets) && dc;

		if (showDC) {
			span.innerHTML = `<i class="fa-solid fa-dice-d20"></i><span class="a5e-enricher__dc">DC ${dc}</span>${label}`;
		} else {
			span.innerHTML = `<i class="fa-solid fa-dice-d20"></i>${label}`;
		}

		return span;
	}

	async createInvalidTag(hint: string): Promise<HTMLElement | null> {
		const span = document.createElement('span');
		span.classList.add('a5e-enricher');
		span.classList.add('a5e-enricher--invalid');

		span.dataset.tooltip = hint;

		span.innerHTML = 'Invalid Enricher';

		return span;
	}

	/**
	 * Parses information based on button clicked and calls appropriate roll function.
	 * @param event   Triggering click event.
	 */
	onRoll(event: MouseEvent): void {
		// FIXME: Try not doing a closest search.
		const target = (event.target as HTMLElement | null)?.closest(
			'.a5e-enricher--roll',
		) as HTMLElement | null;

		if (!target) return;
		event.stopPropagation();

		const selectedTokens = canvas?.tokens?.controlled;
		if (!selectedTokens?.length) {
			ui.notifications?.error('No tokens selected.');
			return;
		}

		const { dataset } = target;

		const universalOptions = {
			dc: { name: 'dc', type: 'number' },
			expertisedice: { name: 'expertiseDice', type: 'number' },
			rollmode: { name: 'rollMode', type: 'number' },
			situationalmods: { name: 'situationalMods', type: 'string' },
			skiprolldialog: { name: 'skipRollDialog', type: 'boolean' },
			visibilitymode: { name: 'visibilityMode', type: 'string' },
		} as Record<string, { name: string; type: string }>;

		if (dataset.enricherType === 'check') {
			if (dataset.skill) {
				const skillOptions = {
					ability: { name: 'abilityKey', type: 'string' },
					minroll: { name: 'minRoll', type: 'number' },
					...universalOptions,
				} as Record<string, { name: string; type: string }>;

				const rollOptions = this.#getOptions(target, skillOptions);

				for (const selectedToken of selectedTokens) {
					// @ts-expect-error
					const { actor }: { actor: BaseActorA5e | null } = selectedToken;
					if (!actor) {
						ui.notifications?.error(`No actor found on given token "${selectedToken.name}"`);
						continue;
					}
					actor.rollSkillCheck(dataset.skill, rollOptions);
				}
				return;
			}

			if (dataset.ability) {
				const rollOptions = this.#getOptions(target, universalOptions);
				for (const selectedToken of selectedTokens) {
					// @ts-expect-error
					const { actor }: { actor: BaseActorA5e | null } = selectedToken;
					if (!actor) {
						ui.notifications?.error(`No actor found on given token "${selectedToken.name}"`);
						continue;
					}
					actor.rollAbilityCheck(dataset.ability, rollOptions);
				}

				return;
			}
		}

		if (dataset.enricherType === 'save') {
			const saveOptions = {
				type: { name: 'saveType', type: 'string' },
				...universalOptions,
			} as Record<string, { name: string; type: string }>;

			const rollOptions = this.#getOptions(target, saveOptions);

			if (dataset.type === 'death') {
				for (const selectedToken of selectedTokens) {
					// @ts-expect-error
					const { actor }: { actor: BaseActorA5e | null } = selectedToken;
					if (!actor) {
						ui.notifications?.error(`No actor found on given token "${selectedToken.name}"`);
						continue;
					}
					actor.rollDeathSavingThrow(rollOptions);
				}

				return;
			}

			if (dataset.type === 'concentration') {
				for (const selectedToken of selectedTokens) {
					// @ts-expect-error
					const { actor }: { actor: BaseActorA5e | null } = selectedToken;
					if (!actor) {
						ui.notifications?.error(`No actor found on given token "${selectedToken.name}"`);
						continue;
					}
					actor.rollSavingThrow('con', rollOptions);
				}

				return;
			}

			if (dataset.ability) {
				for (const selectedToken of selectedTokens) {
					// @ts-expect-error
					const { actor }: { actor: BaseActorA5e | null } = selectedToken;
					if (!actor) {
						ui.notifications?.error(`No actor found on given token "${selectedToken.name}"`);
						continue;
					}
					actor.rollSavingThrow(dataset.ability, rollOptions);
				}
			}
		}
	}

	/* -------------------------------------------- */
	/*  Effect Enrichers: Condition                 */
	/* -------------------------------------------- */

	/**
	 * Provides basic argument validation for saves and provides replacement for the enriched text.
	 * @param args      Record of arguments passed in.
	 * @param options   Options provided to customize text enrichment. Unused
	 * @returns An HTML element to insert in place of the matched text or
	 *          null to indicate that no replacement should be made.
	 */
	async #enrichCondition(
		args: Record<string, any>,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		options?: TextEditor.EnrichmentOptions,
	): Promise<HTMLElement | null> {
		const { id }: { id?: string } = args;
		if (!id) {
			ui.notifications?.error('Enricher is missing condition id.');
			return null;
		}

		if (!Object.keys(CONFIG.A5E.conditions).includes(id)) {
			ui.notifications?.error(`Invalid condition ${id}`);
			return null;
		}

		const label = CONFIG.A5E.conditions[id] as string;
		return this.#createEffectButton(args, label);
	}

	/**
	 * Creates a effect button to replace enriched text.
	 * @param args    Record of arguments passed in and stored in element.
	 * @param label   The label for the output button
	 * @returns An HTML element to insert in place of the matched text or
	 *          null to indicate that no replacement should be made.
	 */
	async #createEffectButton(args: Record<string, any>, label: string): Promise<HTMLElement | null> {
		const span = document.createElement('span');
		span.classList.add('a5e-enricher');
		span.classList.add('a5e-enricher--effect');

		this.#addToDataset(span, args);

		// @ts-expect-error
		const icon = CONFIG.statusEffects.find((s) => s.id === args.id)?.img;

		span.innerHTML = `<img src="${icon}"></i>${label}`;
		return span;
	}

	/**
	 * Parses information based on button clicked and calls appropriate effect function.
	 * @param event   Triggering click event.
	 */
	onEffect(event: MouseEvent): void {
		// FIXME: Try not doing a closest search.
		const target = (event.target as HTMLElement | null)?.closest(
			'.a5e-enricher--effect',
		) as HTMLElement | null;

		if (!target) return;
		event.stopPropagation();

		const selectedTokens = canvas?.tokens?.controlled;
		if (!selectedTokens?.length) {
			ui.notifications?.error('No tokens selected.');
			return;
		}

		const { dataset } = target;

		if (dataset.enricherType === 'condition') {
			const conditionOptions = {
				id: { name: 'id', type: 'string' },
			};
			const { id } = this.#getOptions(target, conditionOptions);

			for (const selectedToken of selectedTokens) {
				// @ts-expect-error
				const { actor }: { actor: BaseActorA5e | null } = selectedToken;
				if (!actor) {
					ui.notifications?.error(`No actor found on given token "${selectedToken.name}"`);
					continue;
				}
				actor.toggleStatusEffect(id);
			}
		}
	}

	/* -------------------------------------------- */
	/*  Choose Enrichers                            */
	/* -------------------------------------------- */

	/**
	 * Parse the enriched string and provide the appropriate content.
	 * @param match      The regular expression match result.
	 * @param options    Options provided to customize text enrichment. Unused
	 * @returns An HTML element to insert in place of the matched text or
	 *          null to indicate that no replacement should be made.
	 */
	async parseChooseInput(
		match: RegExpMatchArray,
		options?: TextEditor.EnrichmentOptions,
	): Promise<HTMLElement | null> {
		const { label, argString } = match.groups as { label: string; argString: string };

		// eslint-disable-next-line no-useless-escape
		// const argRegex = /(\[(?<weight>\d+)\])?(?<type>uuid|text)=((?<value>[\d\w\-\.]+)|"(?<value>[\d\w\-\. ]+)")/gi;
		// const args = [...argString.matchAll(argRegex)];

		// return this.#enrichChoose(label, args, options);
	}

	async #enrichChoose(
		label: string,
		args: RegExpExecArray[],
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		options?: TextEditor.EnrichmentOptions,
	): Promise<HTMLElement | null> {
		const results: string[] = [];
		const icons: string[] = [];

		// weighting
		for (const arg of args) {
			let value = '';
			if (arg.groups?.type === 'uuid') {
				value = `@UUID[${arg.groups?.value}]`;
				// eslint-disable-next-line no-await-in-loop
				const item = (await fromUuid(arg.groups?.value)) as BaseItemA5e;
				icons.push(item?.img as string);
			} else {
				value = `${arg.groups?.value}`;
				icons.push('');
			}
			const weight = arg.groups?.weight ? Number.parseInt(arg.groups.weight, 10) : 1;
			for (let i = 0; i < weight; i += 1) {
				results.push(value);
			}
		}

		const span = document.createElement('span');
		span.classList.add('a5e-enricher');
		span.classList.add('a5e-enricher--choose');
		span.dataset.results = results.join('|');
		span.dataset.icons = icons.join('|');
		span.innerHTML = `<i class="fas fa-th-list"></i>${label}`;
		return span;
	}

	async onChoose(event: MouseEvent): Promise<void> {
		const target = (event.target as HTMLElement | null)?.closest(
			'.a5e-enricher--choose',
		) as HTMLElement | null;

		if (!target) return;
		event.stopPropagation();

		const { dataset } = target;

		const results = dataset.results?.split('|');
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const icons = dataset.icons?.split('|');
		if (!results) return;

		const roll = new Roll(`1d${results.length}`);
		await roll.evaluate();

		const result = results[(roll.total as number) - 1];

		await roll.toMessage();
		const messageData = {
			author: game.user?.id,
			// speaker: ChatMessage.getSpeaker(),
			// sound: CONFIG.sounds.dice,
			content: `${result}`,
		};

		await ChatMessage.create(messageData);
	}
}

export { A5eEnricherManager };
