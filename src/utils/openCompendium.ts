import ImportCompendiumSelectionDialog from '../apps/dialogs/ImportCompendiumSelectionDialog.svelte';

import GenericDialog from '../apps/dialogs/initializers/GenericDialog';
import ItemCompendiumSheet from '../apps/ItemCompendiumSheet';
import ManeuverCompendiumSheet from '../apps/ManeuverCompendiumSheet';
import SpellCompendiumSheet from '../apps/SpellCompendiumSheet';

const SHEETS = {
  inventory: ItemCompendiumSheet,
  maneuvers: ManeuverCompendiumSheet,
  spells: SpellCompendiumSheet
};

export default async function openCompendium(
  actor: typeof Actor,
  tab: 'inventory' | 'maneuvers' | 'spells',
  data: Record<string, any> = {}
) {
  const { importFunction } = data;
  let { pack } = data;

  const hideDialog = game.settings.get('a5e', 'hideActorCompendiumSelectionDialog') ?? false;

  if (!hideDialog) {
    const dialog = new GenericDialog(
      'Select Compendium',
      ImportCompendiumSelectionDialog,
      { tab, defaultSelection: CONFIG.A5E.defaultActorImportCompendia[tab] }
    );

    await dialog.render(true);
    const dialogData = await dialog.promise;
    if (!dialogData?.pack) return;
    pack = dialogData.pack;
  }

  const collection = pack
    ? game.packs.get(pack)
    : game.packs.get(CONFIG.A5E.defaultActorImportCompendia[tab]);

  if (!collection) {
    ui.notifications.error(`No compendium found for ${tab}`);
    return;
  }

  const importer = importFunction
    ?? ((docs: any[]) => actor.createEmbeddedDocuments('Item', docs));

  const p = new SHEETS[tab]({ collection }, { importer });
  p.render(true);
}
