/**
 * A custom SchemaField for defining package compatibility versions.
 * @property {string} minimum     The Package will not function before this version
 * @property {string} verified    Verified compatible up to this version
 * @property {string} maximum     The Package will not function after this version
 */
import * as fields from '../data/fields.d.mts';
import { DataModelValidationFailure } from '../data/validation-failure.d.mts';
import DataModel from '../abstract/data.d.mts';

export class PackageCompatibility extends fields.SchemaField {
  constructor(options: any);
}
/**
 * A custom SchemaField for defining package relationships.
 * @property {RelatedPackage[]} systems     Systems that this Package supports
 * @property {RelatedPackage[]} requires    Packages that are required for base functionality
 * @property {RelatedPackage[]} recommends  Packages that are recommended for optimal functionality
 */
export class PackageRelationships extends fields.SchemaField {
  /** @inheritdoc */
  constructor(options: any);
}
/**
 * A custom SchemaField for defining a related Package.
 * It may be required to be a specific type of package, by passing the packageType option to the constructor.
 */
export class RelatedPackage extends fields.SchemaField {
  constructor({ packageType, ...options }?: {
    packageType: any;
  });
}
/**
 * A custom SchemaField for defining the folder structure of the included compendium packs.
 */
export class PackageCompendiumFolder extends fields.SchemaField {
  constructor({ depth, ...options }?: {
    depth?: number;
  });
}
/**
 * A special ObjectField which captures a mapping of USER_ROLES to DOCUMENT_OWNERSHIP_LEVELS.
 */
export class CompendiumOwnershipField extends fields.ObjectField {
  /** @override */
  override _validateType(value: any, options: any): void;
}
/**
 * A special SetField which provides additional validation and initialization behavior specific to compendium packs.
 */
export class PackageCompendiumPacks extends fields.SetField {
  /** @override */
  override initialize(value: any, model: any, options?: {}): Set<any>;
  /**
   * Validate each individual compendium pack, ensuring its name and path are unique.
   * @inheritDoc
   */
  _validateElement(value: any, { duplicateNames, duplicatePaths, ...options }?: {
    duplicateNames: any;
    duplicatePaths: any;
  }): DataModelValidationFailure;
}
/**
 * The data schema used to define a Package manifest.
 * Specific types of packages extend this schema with additional fields.
 */
export default class BasePackage extends DataModel {
  /**
   * Define the package type in CONST.PACKAGE_TYPES that this class represents.
   * Each BasePackage subclass must define this attribute.
   * @virtual
   * @type {string}
   */
  static type: string;

  /**
   * Test if a given availability is incompatible with the core version.
   * @param {number} availability  The availability value to test.
   * @returns {boolean}
   */
  static isIncompatibleWithCoreVersion(availability: number): boolean;
  /**
   * The named collection to which this package type belongs
   * @type {string}
   */
  static get collection(): string;
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
    compatibility: PackageCompatibility;
    scripts: fields.SetField;
    esmodules: fields.SetField;
    styles: fields.SetField;
    languages: fields.SetField;
    packs: PackageCompendiumPacks;
    packFolders: fields.SetField;
    relationships: PackageRelationships;
    socket: fields.BooleanField;
    manifest: fields.StringField;
    download: fields.StringField;
    protected: fields.BooleanField;
    exclusive: fields.BooleanField;
    persistentStorage: fields.BooleanField;
  };
  /**
   * Check the given compatibility data against the current installation state and determine its availability.
   * @param {Partial<PackageManifestData>} data  The compatibility data to test.
   * @param {object} [options]
   * @param {ReleaseData} [options.release]      A specific software release for which to test availability.
   *                                             Tests against the current release by default.
   * @returns {number}
   */
  static testAvailability({ compatibility }: PackageManifestData, { release }?: {
    release?: ReleaseData;
  }): number;
  /**
   * Determine if a dependency is within the given compatibility range.
   * @param {PackageCompatibility} compatibility      The compatibility range declared for the dependency, if any
   * @param {BasePackage} dependency                  The known dependency package
   * @returns {boolean}                               Is the dependency compatible with the required range?
   */
  static testDependencyCompatibility(compatibility: PackageCompatibility, dependency: BasePackage): boolean;
  /** @inheritDoc */
  static cleanData(source?: {}, { installed, ...options }?: {
    installed: any;
  }): any;
  /**
   * Validate that a Package ID is allowed.
   * @param {string} id     The candidate ID
   * @throws                An error if the candidate ID is invalid
   */
  static validateId(id: string): void;
  /**
   * Validate a single compendium pack object
   * @param {PackageCompendiumData} packData  Candidate compendium packs data
   * @throws                                  An error if the data is invalid
   */
  static '__#28@#validatePack'(packData: PackageCompendiumData): void;
  /**
   * A wrapper around the default compatibility warning logger which handles some package-specific interactions.
   * @param {string} packageId            The package ID being logged
   * @param {string} message              The warning or error being logged
   * @param {object} options              Logging options passed to foundry.utils.logCompatibilityWarning
   * @param {object} [options.installed]  Is the package installed?
   * @internal
   */
  static _logWarning(packageId: string, message: string, { installed, ...options }?: {
    installed?: object;
  }): void;
  /** @inheritdoc */
  static migrateData(data: any, { installed }?: {
    installed: any;
  }): any;
  /** @internal */
  static _migrateNameToId(data: any, logOptions: any): void;
  /** @internal */
  static _migrateDependenciesNameToId(data: any, logOptions: any): void;
  /** @internal */
  static _migrateToRelationships(data: any, logOptions: any): void;
  /** @internal */
  static _migrateCompatibility(data: any, logOptions: any): void;
  /** @internal */
  static _migrateMediaURL(data: any, logOptions: any): void;
  /** @internal */
  static _migrateOwnership(data: any, logOptions: any): any;
  /** @internal */
  static _migratePackIDs(data: any, logOptions: any): void;
  /** @internal */
  static _migratePackEntityToType(data: any, logOptions: any): void;
  /**
   * Retrieve the latest Package manifest from a provided remote location.
   * @param {string} manifestUrl        A remote manifest URL to load
   * @param {object} options            Additional options which affect package construction
   * @param {boolean} [options.strict=true]   Whether to construct the remote package strictly
   * @return {Promise<ServerPackage>}   A Promise which resolves to a constructed ServerPackage instance
   * @throws                            An error if the retrieved manifest data is invalid
   */
  static fromRemoteManifest(manifestUrl: string, { strict }?: {
    strict?: boolean;
  }): Promise<ServerPackage>;
  /**
   * @param {PackageManifestData} data  Source data for the package
   * @param {object} [options={}]       Options which affect DataModel construction
   */
  constructor(data: PackageManifestData, options?: object);
  /**
   * An availability code in PACKAGE_AVAILABILITY_CODES which defines whether this package can be used.
   * @type {number}
   */
  availability: number;

  /**
   * A flag which tracks whether this package is currently locked.
   * @type {boolean}
   */
  locked: boolean;

  /**
   * A flag which tracks whether this package is a free Exclusive pack
   * @type {boolean}
   */
  exclusive: boolean;

  /**
   * A flag which tracks whether this package is owned, if it is protected.
   * @type {boolean|null}
   */
  owned: boolean | null;

  /**
   * A set of Tags that indicate what kind of Package this is, provided by the Website
   * @type {string[]}
   */
  tags: string[];

  /**
   * A flag which tracks if this package has files stored in the persistent storage folder
   * @type {boolean}
   */
  hasStorage: boolean;
  /**
   * The type of this package instance. A value in CONST.PACKAGE_TYPES.
   * @type {string}
   */
  get type(): string;
  /**
   * The canonical identifier for this package
   * @return {string}
   * @deprecated
   */
  get name(): string;
  /**
   * A flag which defines whether this package is unavailable to be used.
   * @type {boolean}
   */
  get unavailable(): boolean;
  /**
   * Is this Package incompatible with the currently installed core Foundry VTT software version?
   * @type {boolean}
   */
  get incompatibleWithCoreVersion(): boolean;
  /**
   * Test that the dependencies of a package are satisfied as compatible.
   * This method assumes that all packages in modulesCollection have already had their own availability tested.
   * @param {Collection<string,Module>} modulesCollection   A collection which defines the set of available modules
   * @returns {Promise<boolean>}                            Are all required dependencies satisfied?
   * @internal
   */
  _testRequiredDependencies(modulesCollection: Collection<string, Module>): Promise<boolean>;
  /**
   * Test compatibility of a package's supported systems.
   * @param {Collection<string, System>} systemCollection  A collection which defines the set of available systems.
   * @returns {Promise<boolean>}                           True if all supported systems which are currently installed
   *                                                       are compatible or if the package has no supported systems.
   *                                                       Returns false otherwise, or if no supported systems are
   *                                                       installed.
   * @internal
   */
  _testSupportedSystems(systemCollection: Collection<string, System>): Promise<boolean>;
}
