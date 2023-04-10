/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
export default class MigrationBase {
  static version;

  constructor(requiresFlush = false) {
    this.version = (this.constructor).version;
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
  async updateItem(itemData, actorData) { }

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
  async updateToken(tokenData, _actor, _scene) { }

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
