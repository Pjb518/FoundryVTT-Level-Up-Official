/* eslint-disable consistent-return */
import SubObjectManager from '../managers/subItems/SubObjectManager';

export default class ItemDirectoryA5E extends ItemDirectory {
  async _handleDroppedEntry(target, data) {
    const item = await this._getDroppedEntryFromData(data);
    if (!item) return;

    if (item.type !== 'object') return super._handleDroppedEntry(target, data);
    if (item.system.objectType !== 'container') return super._handleDroppedEntry(target, data);
    if (this._entryAlreadyExists(item)) return super._handleDroppedEntry(target, data);

    const folderId = target?.dataset?.folderId ?? null;
    console.log(folderId);
    await SubObjectManager.createContainerOnSideBar(item, folderId);
  }
}
