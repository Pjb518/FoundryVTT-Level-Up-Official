import { itemMigrators } from './v090/migratev090';

/**
 * Migrate a single Item document to incorporate latest data model changes
 *
 * @returns {object}  The updateData to apply
 */
export default function migrateItemData(item) {
  const updateData = {};

  // Item data updates
  if (item.system) {
    itemMigrators.forEach((func) => func(item, updateData));
  }

  return updateData;
}
