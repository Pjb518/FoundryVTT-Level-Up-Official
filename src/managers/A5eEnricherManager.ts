import type { BaseActorA5e } from '../documents/actor/base';

declare namespace A5eEnricherManager {
  type EnricherTypes = 'check' | 'save';
}

class A5eEnricherManager {
  constructor() {
    // TODO: Fill this out
    const x = 1;
  }

  registerCustomEnrichers() {
    const enricherTypes = ['check', 'save'];

    CONFIG.TextEditor.enrichers.push({
      // pattern: \[\[\/(?<enricherType>\w+)(?<argString>( +\w+=([\w\d]+|"[\w\d ]+"))*)\]\]
      // matches: [[/type arg1=val1 arg2=val2 arg3="val 3"]]
      pattern: new RegExp(`\\[\\[\\/(?<enricherType>${enricherTypes.join('|')})(?<argString>( +\\w+=([\\w\\d]+|"[\\w\\d ]+"))*)\\]\\]`, 'gi'),
      enricher: this.parseEnricherInput.bind(this)
    });
    document.body.addEventListener('click', this.rollEvent);
  }

  /**
   * Parse the enriched string and provide the appropriate content.
   * @param {RegExpMatchArray} match       The regular expression match result.
   * @param {EnrichmentOptions} options    Options provided to customize text enrichment.
   * @returns {Promise<HTMLElement|null>}  An HTML element to insert in place of the matched text or
   *                                       null to indicate that no replacement should be made.
  */
  parseEnricherInput(match, options) {
    const { enricherType, argString } = match.groups;

    const args = this.parseArguments(argString);
    args.enricherType = enricherType;

    if (enricherType.toLowerCase() === 'check') {
      return this.enrichCheck(args, options);
    }
    if (enricherType.toLowerCase() === 'save') {
      return this.enrichSave(args, options);
    }
    return null;
  }

  /**
   * Parses the arguments into record format and parses into int if possible.
   * @param {string} argString       The raw arguments string
   * @returns {Record}  An indexed array of config item tuples [arg, val]
  */
  parseArguments(argString: string) {
    const args = argString.toLowerCase().split(' ').filter((item) => item);
    const structured: Record<string, any> = {};

    args.forEach((arg) => {
      const [key, value] = arg.split('=').map((a) => a.trim());
      structured[key] = Number.isNumeric(value) ? parseInt(value, 10) : value;
    });

    return structured;
  }

  enrichCheck(args, options) {
    let label = 'Check';
    if (!args.skill && !args.ability) {
      ui.notifications?.error('Enricher is missing both skill and ability.');
      return null;
    }
    // Checks for a properly defined skill
    if (args.skill) {
      if (!Object.keys(CONFIG.A5E.skills).includes(args.skill)) {
        ui.notifications?.error('Invalid skill name.');
        return null;
      }
      if (args.ability && !Object.keys(CONFIG.A5E.abilities).includes(args.ability)) {
        ui.notifications?.error('Invalid ability name.');
        return null;
      }
      // skill check with or without default ability
      label = `${CONFIG.A5E.skills[args.skill]} ${label}`;
      if (args.dc) label = `DC ${args.dc} ${label}`;
      return this.createButton(args, label);
    }
    // Check if the ability is proper
    if (!Object.keys(CONFIG.A5E.abilities).includes(args.ability)) {
      ui.notifications?.error('Invalid ability name.');
      return null;
    }

    // This means only the ability check is left.
    label = `${CONFIG.A5E.abilities[args.ability]} ${label}`;
    if (args.dc) label = `DC ${args.dc} ${label}`;
    return this.createButton(args, label);
  }

  enrichSave(args, options) {
    let label = 'Saving Throw';
    const saveTypes: string[] = ['death', 'concentration'];

    if (!args.type && !args.ability) {
      ui.notifications?.error('Enricher is missing both type and ability.');
      return null;
    }

    // Is either concentration or death save
    if (args.type) {
      if (!saveTypes.includes(args.type)) {
        ui.notifications?.error('Invalid save type.');
        return null;
      }
      if (args.ability) {
        ui.notifications?.warn('Unnecessary ability argument provided.');
      }
      // Converts the first char of the type to upper case and adds to label
      label = `${args.type[0].toUpperCase()}${args.type.slice(1)} ${label}`;
      if (args.dc) label = `DC ${args.dc} ${label}`;
      return this.createButton(args, label);
    }

    // Check if the ability is proper
    if (!Object.keys(CONFIG.A5E.abilities).includes(args.ability)) {
      ui.notifications?.error('Invalid ability name.');
      return null;
    }

    // This means only the ability save is left.
    label = `${CONFIG.A5E.abilities[args.ability]} ${label}`;
    if (args.dc) label = `DC ${args.dc} ${label}`;
    return this.createButton(args, label);
  }

  static addToDataset(element: HTMLElement, args: Record<string, any>) {
    for (const [key, val] of Object.entries(args)) {
      if (val) element.dataset[key] = val as string;
    }
  }

  createButton(args, label) {
    const span = document.createElement('span');
    span.classList.add('a5e-enricher--roll');
    A5eEnricherManager.addToDataset(span, args);

    const button = document.createElement('a');
    button.dataset.action = 'roll';
    // TODO:
    button.innerHTML = `<i class="fa-solid fa-dice-d20"></i> ${label}`;
    span.insertAdjacentElement('afterbegin', button);
    return span;
  }

  static getOptions(
    element: HTMLElement,
    optionsRecord: Record<string, any>,
    validOptions?: Record<string, string>
  ) {
    for (const [key, val] of Object.entries(element.dataset)) {
      if (validOptions) {
        if (key in validOptions) {
          optionsRecord[validOptions[key]] = val;
        }
      }
      else {
        optionsRecord[key] = val;
      }
    }
    return optionsRecord;
  }

  async rollEvent(event) {
    const target = event.target.closest('.a5e-enricher--roll');
    if (!target) return null;
    event.stopPropagation();
    const rollOptions: Record<string, any> = {};
    const universalOptions: Record<string, string> = {
      expertisedice: 'expertiseDice',
      rollmode: 'rollMode',
      situationalmods: 'situationalMods',
      skiprolldialog: 'skipRollDialog',
      visibilitymode: 'visibilityMode'
    };
    A5eEnricherManager.getOptions(target, rollOptions, universalOptions);
    const selectedToken = canvas?.tokens?.controlled[0];

    if (!selectedToken) {
      ui.notifications?.error('No actor selected.');
      return null;
    }

    // @ts-expect-error
    const { actor }: { actor: BaseActorA5e | null } = selectedToken;

    if (target.dataset.enricherType === 'check') {
      if (target.dataset.skill) {
        const skillOptions: Record<string, string> = {
          ability: 'abilityKey',
          minroll: 'minRoll'
        };
        A5eEnricherManager.getOptions(target, rollOptions, skillOptions);
        return actor?.rollSkillCheck(target.dataset.skill, rollOptions);
      }
      // ability check
      return actor?.rollAbilityCheck(target.dataset.abilityKey, rollOptions);
    }

    if (target.dataset.enricherType === 'save') {
      const saveOptions: Record<string, string> = {
        type: 'saveType'
      };
      A5eEnricherManager.getOptions(target, rollOptions, saveOptions);
      if (target.dataset.saveType === 'death') {
        return actor?.rollDeathSavingThrow(rollOptions);
      }
      if (target.dataset.saveType === 'concentration') {
        return actor?.rollSavingThrow('con', rollOptions);
      }
      return actor?.rollSavingThrow(target.dataset.abilityKey, rollOptions);
    }
    return null;
  }
}

export { A5eEnricherManager };
