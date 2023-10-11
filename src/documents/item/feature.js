import ItemA5e from './item';

import { grantsClassMappings } from '../../config/registerGrantsConfig';

export default class FeatureItemA5e extends ItemA5e {
  prepareBaseData() {
    // Setup Grants system

    this.grants = Object.entries(this.system.grants ?? {}).map(([id, data]) => {
      data._id = id;
      const grant = new grantsClassMappings[data.type](data, { parent: this });

      return grant;
    });
  }
}
