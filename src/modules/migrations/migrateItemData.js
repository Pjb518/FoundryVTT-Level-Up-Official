import migrateItemAreaConfiguration from './helpers/migrateItemAreaConfiguration';
import migrateRangeToArray from './helpers/migrateRangeToArray';
import migrateToNewTemplateSyntax from './helpers/migrateToNewTemplateSyntax';

/**
 * Migrate a single Item document to incorporate latest data model changes
 *
 * @returns {object}  The updateData to apply
 */
export default function migrateItemData(item) {
  const updateData = {};

  // Item data updates
  if (item.data) {
    migrateItemAreaConfiguration(item, updateData);
    migrateRangeToArray(item, updateData);
    migrateToNewTemplateSyntax(item, updateData);
  }

  return updateData;
}
