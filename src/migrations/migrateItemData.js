import { itemMigrators } from './v090/migratev090';
import migrateSpellAttack from './v090/itemData/migrateSpellAttackFix';

const FEATURE_ITEMS = ['background', 'class', 'culture', 'destiny', 'heritage', 'subclass'];
/**
 * Migrate a single Item document to incorporate latest data model changes
 *
 * @returns {object}  The updateData to apply
 */
export default function migrateItemData(item) {
  const updateData = {};

  // Item data updates
  if (item.system && !FEATURE_ITEMS.includes(FEATURE_ITEMS)) {
    itemMigrators.forEach((func) => func(item, updateData));
  }

  // TODO: Remove in 0.10.0
  if (foundry.utils.isNewerVersion(game.settings.get('a5e', 'systemMigrationVersion'), '0.9.1')) {
    migrateSpellAttack(item, updateData);
  }

  return updateData;
}
