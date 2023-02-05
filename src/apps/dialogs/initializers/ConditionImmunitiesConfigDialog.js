// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import ConditionImmunitiesConfigComponent from '../ConditionImmunitiesConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ConditionImmunitiesConfigDialog extends TJSDialog {
  constructor(actor) {
    super({
      title: 'Condition Immunities Config',
      content: {
        class: ConditionImmunitiesConfigComponent,
        props: { actor }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
