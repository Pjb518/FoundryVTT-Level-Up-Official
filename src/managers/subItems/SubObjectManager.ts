import SubItemManager from './SubItemManager';

type ContainerDropOptions = {
  containerUuid?: string
};

export default class SubObjectManager extends SubItemManager {
  #duplicateWarning = 'A5E.validations.warnings.duplicateSubObjectDocument';

  #validateWarning = 'A5E.validations.warnings.invalidSubObjectDocument';

  // constructor(doc: any, attribute: string, options: any) {
  //   super(doc, attribute, options);
  //   // TODO: Add custom options here
  // }

  /** ************************************************
  *               Internal methods
  * ************************************************ */

  /** ************************************************
  *               External methods
  * ************************************************ */

  /** ************************************************
  *               Container methods
  * ************************************************ */
}
