export default class MigrationBase {
  constructor(version) {
    this.version = version;
    this.requiresFlush = false;
  }

  /**
   *
   * @param {Object} actorData
   * @returns {Promise<void>}
   */
  async updateActor(actorData) { }

  /**
   *
   * @param {*} itemData
   * @param {*} actorData
   * @returns {Promise<void>}
   */
  async preUpdateItem(itemData, actorData) { }

  /**
   *
   * @param {*} itemData
   * @returns {Promise<void>}
   */
  async updateItem(itemData) { }

  /**
   *
   * @param {*} macroData
   * @returns {Promise<void>}
   */
  async updateMacro(macroData) { }

  /**
   *
   * @param {*} tokenData
   * @returns {Promise<void>}
   */
  async updateToken(tokenData) { }

  /**
   *
   * @param {*} userData
   * @returns {Promise<void>}
   */
  async updateUse(userData) { }

  /**
   *
   * @returns {Promise<void>}
   */
  async migrate() { }
}
