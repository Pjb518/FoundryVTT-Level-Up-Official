// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import SpellConfigDialogComponent from '../ActorSpellConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ActorSpellConfigDialog extends TJSDialog {
  constructor(actor) {
    super({
      title: 'Spell Config',
      content: {
        class: SpellConfigDialogComponent,
        props: { actor }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
