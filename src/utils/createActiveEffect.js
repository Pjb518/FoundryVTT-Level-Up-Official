// eslint-disable-next-line import/no-unresolved
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

export default async function createEffect(actor, effectType) {
  const updateData = {
    label: localize('A5E.effects.new'),
    icon: 'icons/svg/aura.svg',
    origin: actor.uuid
  };

  foundry.utils.setProperty(updateData, 'flags.a5e.sort', 0);
  if (effectType === 'inactive') updateData.disabled = true;
  // if (effectType === 'temporary') updateData['duration.turns'] = 1;

  const documents = await actor.createEmbeddedDocuments('ActiveEffect', [updateData]);
  documents.forEach((d) => d?.sheet?.render(true));
}
