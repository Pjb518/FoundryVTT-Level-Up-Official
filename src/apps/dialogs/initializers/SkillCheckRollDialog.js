// eslint-disable-next-line import/no-unresolved
import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

import SkillCheckRollDialog from '../SkillCheckRollDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class ActorAbilityConfigDialog extends TJSDialog {
  constructor(actor, label) {
    super({
      title: 'Ability Config',
      content: {
        class: SkillCheckRollDialog,
        props: { actor, label }
      }
    }, {
      classes: ['a5e-sheet'],
      width: 420
    });
  }
}
