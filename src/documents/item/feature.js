import ItemA5e from './item';

import ItemGrantsManager from '../../managers/ItemGrantsManager';

export default class FeatureItemA5e extends ItemA5e {
  prepareBaseData() {
    super.prepareBaseData();

    // Setup Grants system
    this.grants = new ItemGrantsManager(this);
  }
}
