/**
 * The data schema used to define World manifest files.
 * Extends the basic PackageData schema with some additional world-specific fields.
 * @property {string} system            The game system name which this world relies upon
 * @property {string} coreVersion       The version of the core software for which this world has been migrated
 * @property {string} systemVersion     The version of the game system for which this world has been migrated
 * @property {string} [background]      A web URL or local file path which provides a background banner image
 * @property {string} [nextSession]     An ISO datetime string when the next game session is scheduled to occur
 * @property {boolean} [resetKeys]      Should user access keys be reset as part of the next launch?
 * @property {boolean} [safeMode]       Should the world launch in safe mode?
 * @property {string} [joinTheme]       The theme to use for this world's join page.
 */
import BasePackage from './base-package.d.mts';
import * as fields from '../data/fields.d.mts';

export default class BaseWorld extends BasePackage {
  /** @inheritDoc */
  static defineSchema(): {
    id: fields.StringField;
    title: fields.StringField;
    description: fields.StringField;
    authors: fields.SetField;
    url: fields.StringField;
    license: fields.StringField;
    readme: fields.StringField;
    bugs: fields.StringField;
    changelog: fields.StringField;
    flags: fields.ObjectField;
    media: fields.SetField;
    version: fields.StringField;
    compatibility: import('./base-package.d.mts').PackageCompatibility;
    scripts: fields.SetField;
    esmodules: fields.SetField;
    styles: fields.SetField;
    languages: fields.SetField;
    packs: import('./base-package.d.mts').PackageCompendiumPacks;
    packFolders: fields.SetField;
    relationships: import('./base-package.d.mts').PackageRelationships;
    socket: fields.BooleanField;
    manifest: fields.StringField;
    download: fields.StringField;
    protected: fields.BooleanField;
    exclusive: fields.BooleanField;
    persistentStorage: fields.BooleanField;
  } & {
    system: fields.StringField;
    background: fields.StringField;
    joinTheme: fields.StringField;
    coreVersion: fields.StringField;
    systemVersion: fields.StringField;
    lastPlayed: fields.StringField;
    playtime: fields.NumberField;
    nextSession: fields.StringField;
    resetKeys: fields.BooleanField;
    safeMode: fields.BooleanField;
    version: fields.StringField;
  };
  /**
   * The default icon used for this type of Package.
   * @type {string}
   */
  static icon: string;
  /** @inheritDoc */
  static migrateData(data: any): any;
  /**
   * Check the given compatibility data against the current installation state and determine its availability.
   * @param {Partial<PackageManifestData>} data  The compatibility data to test.
   * @param {object} [options]
   * @param {ReleaseData} [options.release]      A specific software release for which to test availability.
   *                                             Tests against the current release by default.
   * @param {Collection<string, Module>} [options.modules]  A specific collection of modules to test availability
   *                                                        against. Tests against the currently installed modules by
   *                                                        default.
   * @param {Collection<string, System>} [options.systems]  A specific collection of systems to test availability
   *                                                        against. Tests against the currently installed systems by
   *                                                        default.
   * @param {number} [options.systemAvailabilityThreshold]  Ignore the world's own core software compatibility and
   *                                                        instead defer entirely to the system's core software
   *                                                        compatibility, if the world's availability is less than
   *                                                        this.
   * @returns {number}
   */
  static testAvailability(data: PackageManifestData, {
    release, modules, systems, systemAvailabilityThreshold }
    ?: {
      release?: ReleaseData;
      modules?: Collection<string, Module>;
      systems?: Collection<string, System>;
      systemAvailabilityThreshold?: number;
    }): number;
}
