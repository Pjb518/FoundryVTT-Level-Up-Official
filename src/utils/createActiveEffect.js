import { localize } from '#runtime/svelte/helper';

import ActionsManager from '../managers/ActionsManager';

export default async function createEffect(document, { effectType, actionId }) {
  const updateData = {
    label: localize('A5E.effects.new'),
    icon: document.documentName === 'Item' ? document.img : 'icons/svg/aura.svg',
    origin: document.uuid
  };

  foundry.utils.setProperty(updateData, 'flags.a5e.sort', 0);

  if (document.documentName === 'Item') {
    updateData.transfer = false;
    if (effectType === 'onUse') {
      if (!actionId) {
        ui.notifications.error(localize('A5E.notifications.effects.noActionId'));
        return;
      }

      // Set related flags
      foundry.utils.setProperty(updateData, 'flags.a5e.transferType', 'onUse');
      foundry.utils.setProperty(updateData, 'flags.a5e.actionId', actionId);
    } else {
      foundry.utils.setProperty(updateData, 'flags.a5e.transferType', 'passive');
    }
  }

  if (effectType === 'inactive') updateData.disabled = true;

  const documents = await document.createEmbeddedDocuments('ActiveEffect', [updateData]);
  documents.forEach((d) => d?.sheet?.render(true));

  // Create prompt on action for effect
  if (effectType === 'onUse') {
    const action = document.actions[actionId];
    if (!action) return;

    ActionsManager.addPrompt(
      document,
      [actionId, action],
      'effect',
      { effectId: documents[0].id }
    );
  }
}
