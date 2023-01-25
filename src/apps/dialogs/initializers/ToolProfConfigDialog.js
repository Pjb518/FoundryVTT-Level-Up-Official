// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import ToolProfConfigComponent from '../ToolProfConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ToolProfConfigDialog extends TJSDialog {
  constructor(actor) {
    super({
      title: 'Tool Proficiencies Config',
      content: {
        class: ToolProfConfigComponent,
        props: { actor }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
