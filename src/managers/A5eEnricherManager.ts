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
      // pattern: \[\[\/(?<type>\w+)(?<argString>( +\w+=([\w\d]+|"[\w\d ]+"))*)\]\]
      // matches: [[/type arg1=val1 arg2=val2 arg3="val 3"]]
      pattern: new RegExp(`\\[\\[\\/(?<type>${enricherTypes.join('|')})(?<argString>( +\\w+=([\\w\\d]+|"[\\w\\d ]+"))*)\\]\\]`, 'gi'),
      enricher: this.parseEnricherInput.bind(this)
    });
  }

  /**
   * Parse the enriched string and provide the appropriate content.
   * @param {RegExpMatchArray} match       The regular expression match result.
   * @param {EnrichmentOptions} options    Options provided to customize text enrichment.
   * @returns {Promise<HTMLElement|null>}  An HTML element to insert in place of the matched text or
   *                                       null to indicate that no replacement should be made.
  */
  parseEnricherInput(match, options) {
    const { type, argString } = match.groups;

    const args = this.parseArguments(argString);

    if (type.toLowerCase() === 'check') {
      return this.enrichCheck(args, options);
    }
    if (type.toLowerCase() === 'save') {
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
    const structured: Record<string, string | number> = {};

    args.forEach((arg) => {
      const [key, value] = arg.split('=').map((a) => a.trim());
      structured[key] = Number.isNumeric(value) ? parseInt(value, 10) : value;
    });

    return structured;
  }

  enrichCheck(args, options) {
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
      // If not using default ability
      if (args.ability) {
        return null;
      }

      // using default ability for skill
      // TODO: Do Stuff
      return null;
    }
    // Check if the ability is proper
    if (!Object.keys(CONFIG.A5E.abilities).includes(args.ability)) {
      ui.notifications?.error('Invalid ability name.');
      return null;
    }

    // This means only the ability save is left.
    // TODO: Do Stuff
    return null;
  }

  enrichSave(args, options) {
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
      // TODO: Do Stuff
      return null;
    }

    // Check if the ability is proper
    if (!Object.keys(CONFIG.A5E.abilities).includes(args.ability)) {
      ui.notifications?.error('Invalid ability name.');
      return null;
    }

    // This means only the ability save is left.
    // TODO: Do Stuff
    return null;
  }
}

export { A5eEnricherManager };
