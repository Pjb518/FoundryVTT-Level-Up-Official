/**
 * @typedef {import("./sub-types.d.mts").DocumentTypesConfiguration} DocumentTypesConfiguration
 */
/**
 * The data schema used to define System manifest files.
 * Extends the basic PackageData schema with some additional system-specific fields.
 * @property {DocumentTypesConfiguration} [documentTypes]  Additional document subtypes provided by this system.
 * @property {string} [background]        A web URL or local file path which provides a default background banner for
 *                                        worlds which are created using this system
 * @property {string} [initiative]        A default initiative formula used for this system
 * @property {number} [grid]              The default grid settings to use for Scenes in this system
 * @property {number} [grid.type]         A default grid type to use for Scenes in this system
 * @property {number} [grid.distance]     A default distance measurement to use for Scenes in this system
 * @property {string} [grid.units]        A default unit of measure to use for distance measurement in this system
 * @property {number} [grid.diagonals]    The default rule used by this system for diagonal measurement on square grids
 * @property {string} [primaryTokenAttribute] An Actor data attribute path to use for Token primary resource bars
 * @property {string} [secondaryTokenAttribute] An Actor data attribute path to use for Token secondary resource bars
 */
import BasePackage from './base-package.d.mts';
import * as fields from '../data/fields.d.mts';
import AdditionalTypesField from './sub-types.d.mts';

export default class BaseSystem extends BasePackage {
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
    documentTypes: AdditionalTypesField;
    background: fields.StringField;
    initiative: fields.StringField;
    grid: fields.SchemaField;
    primaryTokenAttribute: fields.StringField;
    secondaryTokenAttribute: fields.StringField;
  };
  /**
   * The default icon used for this type of Package.
   * @type {string}
   */
  static icon: string;

  /** @inheritdoc */
  static migrateData(data: any, options: any): any;
  /** @inheritdoc */
  static shimData(data: any, options: any): any;
  /**
   * Does the system template request strict type checking of data compared to template.json inferred types.
   * @type {boolean}
   */
  strictDataCleaning: boolean;
}
export type DocumentTypesConfiguration = import('./sub-types.d.mts').DocumentTypesConfiguration;
