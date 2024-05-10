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

const TYPES = {
  inventory: 'object',
  maneuvers: 'maneuver',
  spells: 'spell'
};

export default async function openCompendium(
  actor: typeof Actor,
  tab: 'inventory' | 'maneuvers' | 'spells',
  data: Record<string, any> = {}
) {
  const { importFunction } = data;
  let { pack } = data;

  const compendiumType = TYPES[tab];
  const packOptions = game.packs.reduce((acc: string[][], p: any) => {
    const id = p.metadata.id || p.collection;
    if (!id) return acc;

    if (p.metadata.type !== 'Item') return acc;

    const canView = p.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER);
    if (!canView) return acc;

    const indexTypes: string[] = [...p.index].map((i: any) => i.type).filter(Boolean);
    if (!indexTypes.every((t: string) => t === compendiumType)) return acc;

    acc.push([id, p.metadata.label]);
    return acc;
  }, []);

  const hideDialog = game.settings.get('a5e', 'hideActorCompendiumSelectionDialog') ?? false;

  if (!hideDialog && packOptions.length > 1) {
    const dialog = new GenericDialog(
      'Select Compendium',
      ImportCompendiumSelectionDialog,
      { packOptions, defaultSelection: CONFIG.A5E.defaultActorImportCompendia[tab] }
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
