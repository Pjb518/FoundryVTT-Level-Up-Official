/**
 * The data schema used to define Module manifest files.
 * Extends the basic PackageData schema with some additional module-specific fields.
 * @property {boolean} [coreTranslation]         Does this module provide a translation for the core software?
 * @property {boolean} [library]                 A library module provides no user-facing functionality and is solely
 *                                               for use by other modules. Loaded before any system or module scripts.
 * @property {Object<string[]>} [documentTypes]  Additional document subtypes provided by this module.
 */
import BasePackage from './base-package.d.mts';
import * as fields from '../data/fields.d.mts';
import AdditionalTypesField from './sub-types.d.mts';

export default class BaseModule extends BasePackage {
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
    coreTranslation: fields.BooleanField;
    library: fields.BooleanField;
    documentTypes: AdditionalTypesField;
  };
  /**
   * The default icon used for this type of Package.
   * @type {string}
   */
  static icon: string;
}
