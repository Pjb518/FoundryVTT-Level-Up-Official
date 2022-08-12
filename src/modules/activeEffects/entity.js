// import A5E from '../config';

/** TODO:
 * - Allow editing of owned items.
 * - Enable active effects on item equip/unequip.
 * - Allow references to core actor data.
 * - Allow arithmetic in data definitions.
 * - Allow application of effects to other tokens.
 * - Priority of effects.
 * - Allow macros to be executed.
 *
 * Add system-specific logic to the base ActiveEffect Class
*/
export default class ActiveEffect5e extends ActiveEffect {
  /**
   * Transfer the affect to another token.
   */
  transferEffect(token) {
    const data = [{
      label: this.label,
      origin: this.parent.uuid,
      changes: this.changes
    }];

    token.actor.createEmbeddedDocuments('ActiveEffect', data);
  }
}
