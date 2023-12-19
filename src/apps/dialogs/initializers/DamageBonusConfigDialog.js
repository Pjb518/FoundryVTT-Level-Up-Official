import { TJSDocument } from '#runtime/svelte/store/fvtt/document';
import { TJSDialog } from '#runtime/svelte/application';

import DamageBonusDialog from '../DamageBonusConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class DamageBonusConfigDialog extends TJSDialog {
  constructor(actor, damageBonusId, options = {}) {
    super({
      title: `${actor.name} Damage Bonus Configuration`,
      content: {
        class: DamageBonusDialog,
        props: { actor: new TJSDocument(actor), damageBonusId }
      },
      zIndex: null
    }, {
      id: `${actor.uuid}-damage-bonus-config-dialog-${damageBonusId}`,
      classes: ['a5e-sheet'],
      width: options.width ?? 432
    });

    // Add to dialogs
    game.a5e.dialogs.bonuses.damage[damageBonusId] = this;
  }
}
