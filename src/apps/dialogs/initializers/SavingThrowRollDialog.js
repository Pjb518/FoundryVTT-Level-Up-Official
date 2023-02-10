// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

import SavingThrowRollDialog from '../SavingThrowRollDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ActorAbilityConfigDialog extends TJSDialog {
  constructor(actor, label) {
    super({
      title: 'Ability Config',
      content: {
        class: SavingThrowRollDialog,
        props: { actor, label }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
