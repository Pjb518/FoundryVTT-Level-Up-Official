import ItemA5e from './item';

import ItemGrantsManager from '../../managers/ItemGrantsManager';

export default class FeatureItemA5e extends ItemA5e {
  prepareBaseData() {
    super.prepareBaseData();

    // Setup Grants system
    // this.grants = Object.entries(this.system.grants ?? {}).map(([id, data]) => {
    //   data._id = id;
    //   const grant = new grantsClassMappings[data.type](data, { parent: this });

    //   return grant;
    // });
    // this.grants = new ItemGrantsManager(this);
  }
}
