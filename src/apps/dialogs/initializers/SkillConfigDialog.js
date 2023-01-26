// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import SkillConfigComponent from '../SkillConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class SkillConfigDialog extends TJSDialog {
  constructor(actor, skillKey, label) {
    super({
      title: `${game.i18n.localize(label)} Config`,
      content: {
        class: SkillConfigComponent,
        props: { actor, skillKey }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420,
      height: 500
    });
  }
}
