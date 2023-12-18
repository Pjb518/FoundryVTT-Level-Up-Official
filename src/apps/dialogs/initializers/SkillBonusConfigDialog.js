import { TJSDocument } from '#runtime/svelte/store/fvtt/document';
import { TJSDialog } from '#runtime/svelte/application';

import SkillBonusDialog from '../SkillBonusConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class SkillBonusConfigDialog extends TJSDialog {
  constructor(actor, skillBonusId, options = {}) {
    super({
      title: `${actor.name} Skill Bonus Configuration`,
      content: {
        class: SkillBonusDialog,
        props: { actor: new TJSDocument(actor), skillBonusId }
      },
      zIndex: null
    }, {
      classes: ['a5e-sheet'],
      width: options.width ?? 432
    });
  }
}
