// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import MigrationBase from './MigrationBase';
import MigrationRunner from './MigrationRunner';

import * as Migrations from './migrations';

export default class MigrationList {
  static #list = Object.values(Migrations ?? {});

  /**
   * @returns {Number}
   */
  static get latestVersion() {
    return Math.max(...this.#list.map((m) => m.version));
  }

  /**
   * @returns {Array<MigrationBase>}
   */
  static constructAll() {
    return this.#list.map((Migration) => new Migration());
  }

  /**
   *
   * @param {Number} version
   * @returns {Array<MigrationBase>}
   */
  static constructFromVersion(version = null) {
    const minimumVersion = Number(version) || MigrationRunner.RECOMMENDED_SAFE_VERSION;
    return this.#list
      .filter((Migration) => Migration.version > minimumVersion)
      .map((Migration) => new Migration());
  }

  /**
   *
   * @param {Number} minimum
   * @param {Number} maximum
   * @returns {Array<MigrationBase>}
   */
  static constructRange(minimum, maximum = Infinity) {
    return this.#list
      .filter((Migration) => Migration.version >= minimum && Migration.version <= maximum)
      .map((Migration) => new Migration());
  }
}
