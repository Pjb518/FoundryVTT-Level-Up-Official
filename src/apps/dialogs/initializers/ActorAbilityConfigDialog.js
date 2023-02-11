// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import AbilityConfigComponent from '../ActorAbilityConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ActorAbilityConfigDialog extends TJSDialog {
  constructor(actorDocument, abilityKey) {
    super({
      title: game.i18n.format(
        'A5E.AbilityScoreConfigurationPrompt',
        { name: actorDocument.name, ability: game.i18n.localize(CONFIG.A5E.abilities[abilityKey]) }
      ),
      content: {
        class: AbilityConfigComponent,
        props: { actorDocument, abilityKey }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
