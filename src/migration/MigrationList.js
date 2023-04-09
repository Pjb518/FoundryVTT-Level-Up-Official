import MigrationBase from './MigrationBase';
import MigrationRunner from './MigrationRunner';

export default class MigrationList {
  // TODO:: Update this when migrations are ready
  static #list = Object.values({});

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

  static constructFromVersion(version = null) {
    const minimumVersion = Number(version) || MigrationRunner.SAFE_VERSION;
    return this.#list
      .filter((Migration) => Migration.version > minimumVersion)
      .map((Migration) => new Migration());
  }

  static constructRange(minimum, maximum = Infinity) {
    return this.#list
      .filter((Migration) => Migration.version >= minimum && Migration.version <= maximum)
      .map((Migration) => new Migration());
  }
}
