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
      pattern: new RegExp(`@(?<type>${enricherTypes.join('|')})?( (?<stat>\\w+))`, 'gi'),
      enricher: this.parseEnrichInput
    });
  }

  parseEnrichInput(match, options) {
    console.log('EnricherTestSuccess');

    const { type, stat } = match.groups;

    if (type.toLowerCase() === 'check') {
      return null;
    }
    if (type.toLowerCase() === 'save') {
      return null;
    }
    return null;
  }
}

export { A5eEnricherManager };
