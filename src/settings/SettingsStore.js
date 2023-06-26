// eslint-disable-next-line import/no-unresolved
import { TJSGameSettings } from '@typhonjs-fvtt/svelte-standard/store';

class A5eGameSettings extends TJSGameSettings {
  constructor() {
    super('a5e');

    this.refreshSettings = [];
  }

  init() {
    const namespace = 'a5e';
    const scope = { client: 'client', world: 'world' };
    const settings = [
      {
        namespace,
        key: 'automatedConditions',
        options: {
          name: 'A5E.settings.automateConditions',
          hint: 'A5E.settings.hints.automateConditions',
          scope: scope.world,
          config: true,
          type: Array,
          default: ['bloodied']
        }
      },
      {
        namespace,
        key: 'hideChatDescriptionsByDefault',
        options: {
          name: 'A5E.settings.hideChatDescriptionsByDefault',
          hint: 'A5E.settings.hints.hideChatDescriptionsByDefault',
          scope: scope.client,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'protectRolls',
        options: {
          name: 'A5E.settings.protectRolls',
          hint: 'A5E.settings.hints.protectRolls',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'terseRollFormulae',
        options: {
          name: 'A5E.settings.terseRollFormulae',
          hint: 'A5E.settings.hints.terseRollFormulae',
          scope: scope.client,
          config: true,
          default: false,
          type: Boolean
        }
      }
    ];

    this.registerAll(settings, false);
    this.refreshSettings = settings
      .filter((s) => s.options.refreshRequired)
      .map((s) => s.key);
  }
}

// eslint-disable-next-line import/prefer-default-export
export const gameSettings = new A5eGameSettings();
