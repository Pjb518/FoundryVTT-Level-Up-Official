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
      // pattern: \[\[\/(?<type>\w+)(?<options>( +\w+=([\w\d]+|"[\w\d ]+"))*)\]\]
      // matches: [[/type arg1=val1 arg2=val2 arg3="val 3"]]
      pattern: new RegExp(`\\[\\[\\/(?<type>${enricherTypes.join('|')})(?<config>( +\\w+=([\\w\\d]+|"[\\w\\d ]+"))*)\\]\\]`, 'gi'),
      enricher: this.parseEnricherInput
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
    const { type, config } = match.groups;

    const configArray = this.parseConfig(config);

    if (type.toLowerCase() === 'check') {
      console.log('CheckTest');
      return this.enrichCheck(configArray, options);
    }
    if (type.toLowerCase() === 'save') {
      console.log('SaveTest');
      return this.enrichSave(configArray, options);
    }
    return null;
  }

  /**
   * Parses the configuration into array format and changes numbers to Number
   * @param {string} config       The raw config string
   * @returns {indexedArray}  An indexed array of config item tuples [arg, val]
  */
  parseConfig(config: string) {
    const configItems = config.toLowerCase().split(' ').filter((item) => item);
    const configArray: { [key: string]: string | number } = {};
    for (const item of configItems) {
      const configItem: (string | number)[] = item.split('=');
      if (Number.isNumeric(configItem[1])) {
        configItem[1] = Number(configItem[1]);
      }
      [configArray[configItem[0]]] = configItem;
    }
    return configArray;
  }

  enrichCheck(configArray, options) {
    if (!('skill' in configArray && configArray.skill in CONFIG.A5E.skills)
      && !('ability' in configArray && configArray.ability in CONFIG.A5E.abilities)) {
      // TODO: throw an error
      console.log('Error: No valid skill or ability defined.');
      return null;
    }
    // TODO: roll
    return null;
  }

  enrichSave(configArray, options) {
    const saveTypes = ['death', 'concentration'];
    if (!('type' in configArray && (configArray.type in saveTypes || configArray.type in CONFIG.A5E.abilities))
      && !('ability' in configArray && configArray.ability in CONFIG.A5E.abilities)) {
      // TODO: throw an error
      console.log('Error: No valid type or ability defined.');
      return null;
    }
    if (('type' in configArray) && ('ability' in configArray)) {
      // TODO: throw a warning
      console.log('Warning: Unnecessary ability defined.');
      return null;
    }
    // TODO: roll
    return null;
  }
}

export { A5eEnricherManager };
