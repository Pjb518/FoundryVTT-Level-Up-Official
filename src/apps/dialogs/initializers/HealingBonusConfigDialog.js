// eslint-disable-next-line import/no-unresolved
import { TJSDocument } from '#runtime/svelte/store/fvtt/document';
import { TJSDialog } from '#runtime/svelte/application';

// eslint-disable-next-line import/no-unresolved

import HealingBonusDialog from '../HealingBonusConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class HealingBonusConfigDialog extends TJSDialog {
  constructor(actor, healingBonusId, options = {}) {
    super({
      title: `${actor.name} Healing Bonus Configuration`,
      content: {
        class: HealingBonusDialog,
        props: { actor: new TJSDocument(actor), healingBonusId }
      }
    }, {
      classes: ['a5e-sheet'],
      width: options.width ?? 432
    });
  }
}
