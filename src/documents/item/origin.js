import BaseItemA5e from './base';

import ForeignDocumentManager from '../../managers/ForeignDocumentManager';

export default class OriginItemA5e extends BaseItemA5e {
  prepareDerivedData() {
    if (['culture', 'background', 'heritage'].includes(this.type)) this.prepareForeignDocuments();
  }

  prepareForeignDocuments() {
    if (this.type === 'culture') {
      foundry.utils.setProperty(this, 'features', new ForeignDocumentManager(
        this,
        'features',
        { validate: (obj) => obj.type === 'feature' && obj.system?.featureType === 'culture' }
      ));
    }

    if (['background', 'culture'].includes(this.type)) {
      foundry.utils.setProperty(this, 'equipment', new ForeignDocumentManager(
        this,
        'equipment',
        { validate: (obj) => obj.type === 'object' }
      ));
    }

    if (this.type === 'heritage') {
      const types = ['features', 'gifts', 'paragonGifts'];

      types.forEach((type) => {
        foundry.utils.setProperty(this, type, new ForeignDocumentManager(
          this,
          type,
          { validate: (obj) => obj.type === 'feature' && obj.system?.featureType === 'heritage' }
        ));
      });
    }
  }

  async _onCreate(data, options, user) {
    // Create Movement / Senses Effects for heritages
    if (this.type === 'heritage') {
      const effectData = {
        name: 'Movement & Senses Configuration',
        icon: this.img,
        changes: [
          {
            key: 'system.attributes.movement.walk.distance',
            value: 30,
            mode: CONFIG.A5E.ACTIVE_EFFECT_MODES.OVERRIDE
          }
        ]
      };

      effectData.transfer = false;
      foundry.utils.setProperty(effectData, 'flags.a5e.transferType', 'permanent');

      await this.createEmbeddedDocuments('ActiveEffect', [effectData]);
    }

    super._onCreate(data, options, user);
  }
}
