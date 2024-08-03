import type { BaseActorA5e } from '../documents/actor/base';

declare namespace A5eEnricherManager {
  type EnricherTypes = 'check' | 'save';
}

class A5eEnricherManager {
  /**
   * Pushes enrichers to config and adds
  */
  registerCustomEnrichers() {
    const enricherTypes = ['check', 'save', 'condition'];

    CONFIG.TextEditor.enrichers.push({
      /**
       * pattern: \[\[\/(?<enricherType>\w+)(?<argString>( +\w+=([\w\d]+|"[\w\d ]+"))*)\]\]
       * matches: [[/type arg1=val1 arg2=val2 arg3="val 3"]]
       */
      pattern: new RegExp(`\\[\\[\\/(?<enricherType>${enricherTypes.join('|')})(?<argString>( +\\w+=([\\w\\d]+|"[\\w\\d ]+"))*)\\]\\]`, 'gi'),
      enricher: this.parseEnricherInput.bind(this)
    });

    // FIXME: This is inefficient
    document.body.addEventListener('click', this.onRoll.bind(this));
    document.body.addEventListener('click', this.onEffect.bind(this));
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
    options?: TextEditor.EnrichmentOptions
  ): Promise<HTMLElement | null> {
    const { enricherType, argString } = match.groups as { enricherType: string, argString: string };

    const args = this.#parseArguments(argString);
    args.enricherType = enricherType.toLowerCase();

    if (enricherType === 'check') {
      return this.#enrichCheck(args, options);
    } if (enricherType === 'save') {
      return this.#enrichSave(args, options);
    } if (enricherType === 'condition') {
      return this.#enrichCondition(args, options);
    }

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
    const args = argString.toLowerCase().split(' ').filter(Boolean);
    const structured: Record<string, any> = {};

    args.forEach((arg) => {
      const [key, value] = arg.split('=').map((a) => a.trim());
      structured[key] = Number.isNumeric(value) ? parseInt(value, 10) : value;
    });

    return structured;
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
    validOptions?: Record<string, { name: string, type: string }>
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

      if (type === 'number') optionsRecord[name] = parseInt(val, 10);
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
    options?: TextEditor.EnrichmentOptions
  ): Promise<HTMLElement | null> {
    let label = 'Check';
    const { ability, skill }: { ability?: string, skill?: string } = args;

    if (!skill && !ability) {
      ui.notifications?.error('Enricher is missing both skill and ability.');
      return null;
    }

    // Check if the ability is proper
    if (ability && !Object.keys(CONFIG.A5E.abilities).includes(ability)) {
      ui.notifications?.error('Invalid ability name.');
      return null;
    }

    // Checks for a properly defined skill
    if (skill) {
      if (!Object.keys(CONFIG.A5E.skills).includes(skill)) {
        ui.notifications?.error(`Invalid skill ${skill}.`);
        return null;
      }

      // Skill check with or without default ability
      label = `${CONFIG.A5E.skills[skill]} ${label}`;
      return this.#createRollButton(args, label);
    }

    if (!ability) {
      ui.notifications?.error('Ability not provided');
      return null;
    }

    label = `${CONFIG.A5E.abilities[ability]} ${label}`;
    return this.#createRollButton(args, label);
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
    options?: TextEditor.EnrichmentOptions
  ): Promise<HTMLElement | null> {
    const saveTypes: string[] = ['death', 'concentration'];
    const { type, ability }: { type?: string, ability?: string } = args;
    let label = 'Saving Throw';

    if (!type && !ability) {
      ui.notifications?.error('Enricher is missing both type and ability.');
      return null;
    }

    // Is either concentration or death save
    if (type) {
      if (!saveTypes.includes(type)) {
        ui.notifications?.error(`Invalid save type ${type}.`);
        return null;
      }

      if (ability) {
        ui.notifications?.warn('Unnecessary ability argument provided.');
      }

      label = `${args.type.capitalize()} ${label}`;
      return this.#createRollButton(args, label);
    }

    // Check if the ability is proper
    if (!ability) {
      ui.notifications?.error('Ability not provided');
      return null;
    }

    if (ability && !Object.keys(CONFIG.A5E.abilities).includes(ability)) {
      ui.notifications?.error(`Invalid ability ${ability}.`);
      return null;
    }

    label = `${CONFIG.A5E.abilities[ability]} ${label}`;

    return this.#createRollButton(args, label);
  }

  /**
   * Creates a roll button to replace enriched text.
   * @param args    Record of arguments passed in and stored in element.
   * @param label   The label for the output button
   * @returns An HTML element to insert in place of the matched text or
   *          null to indicate that no replacement should be made.
  */
  async #createRollButton(args: Record<string, any>, label: string): Promise<HTMLElement | null> {
    const span = document.createElement('span');
    span.classList.add('a5e-enricher');
    span.classList.add('a5e-enricher--roll');

    this.#addToDataset(span, args);

    if (game.user?.isGM && args.dc && Number.isNumeric(args.dc)) {
      span.innerHTML = `<i class="fa-solid fa-dice-d20"></i><span class="a5e-enricher__dc">DC ${args.dc}</span>${label}`;
    } else {
      span.innerHTML = `<i class="fa-solid fa-dice-d20"></i>${label}`;
    }

    return span;
  }

  /**
   * Parses information based on button clicked and calls appropriate roll function.
   * @param event   Triggering click event.
  */
  onRoll(event: MouseEvent): void {
    // FIXME: Try not doing a closest search.
    const target = (
      event.target as (HTMLElement | null)
    )?.closest('.a5e-enricher--roll') as (HTMLElement | null);

    if (!target) return;
    event.stopPropagation();

    const selectedTokens = canvas?.tokens?.controlled;
    if (!selectedTokens || selectedTokens.length === 0) {
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
      visibilitymode: { name: 'visibilityMode', type: 'string' }
    } as Record<string, { name: string, type: string }>;

    if (dataset.enricherType === 'check') {
      if (dataset.skill) {
        const skillOptions = {
          ability: { name: 'abilityKey', type: 'string' },
          minroll: { name: 'minRoll', type: 'number' },
          ...universalOptions
        } as Record<string, { name: string, type: string }>;

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
        ...universalOptions
      } as Record<string, { name: string, type: string }>;

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
    options?: TextEditor.EnrichmentOptions
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
    const target = (
      event.target as (HTMLElement | null)
    )?.closest('.a5e-enricher--effect') as (HTMLElement | null);

    if (!target) return;
    event.stopPropagation();

    const selectedTokens = canvas?.tokens?.controlled;
    if (!selectedTokens || selectedTokens.length === 0) {
      ui.notifications?.error('No tokens selected.');
      return;
    }

    const { dataset } = target;

    if (dataset.enricherType === 'condition') {
      const conditionOptions = {
        id: { name: 'id', type: 'string' }
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
}

export { A5eEnricherManager };
