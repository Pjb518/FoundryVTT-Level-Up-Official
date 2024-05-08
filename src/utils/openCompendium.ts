import ItemCompendiumSheet from '../apps/ItemCompendiumSheet';
import ManeuverCompendiumSheet from '../apps/ManeuverCompendiumSheet';
import SpellCompendiumSheet from '../apps/SpellCompendiumSheet';

const SHEETS = {
  inventory: ItemCompendiumSheet,
  maneuvers: ManeuverCompendiumSheet,
  spells: SpellCompendiumSheet
};

export default function openCompendium(
  actor: typeof Actor,
  tab: 'inventory' | 'maneuvers' | 'spells',
  data: Record<string, any> = {}
) {
  const { pack, importFunction } = data;

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
