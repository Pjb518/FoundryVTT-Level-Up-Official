/** @namespace config */
/**
 * A data model definition which describes the application configuration options.
 * These options are persisted in the user data Config folder in the options.json file.
 * The server-side software extends this class and provides additional validations and
 * @extends {DataModel}
 * @memberof config
 *
 * @property {string|null} adminPassword        The server administrator password (obscured)
 * @property {string|null} awsConfig            The relative path (to Config) of an AWS configuration file
 * @property {boolean} compressStatic           Whether to compress static files? True by default
 * @property {string} dataPath                  The absolute path of the user data directory (obscured)
 * @property {boolean} fullscreen               Whether the application should automatically start in fullscreen mode?
 * @property {string|null} hostname             A custom hostname applied to internet invitation addresses and URLs
 * @property {string} language                  The default language for the application
 * @property {string|null} localHostname        A custom hostname applied to local invitation addresses
 * @property {string|null} passwordSalt         A custom salt used for hashing user passwords (obscured)
 * @property {number} port                      The port on which the server is listening
 * @property {number} [protocol]                The Internet Protocol version to use, either 4 or 6.
 * @property {number} proxyPort                 An external-facing proxied port used for invitation addresses and URLs
 * @property {boolean} proxySSL                 Is the application running in SSL mode at a reverse-proxy level?
 * @property {string|null} routePrefix          A URL path part which prefixes normal application routing
 * @property {string|null} sslCert              The relative path (to Config) of a used SSL certificate
 * @property {string|null} sslKey               The relative path (to Config) of a used SSL key
 * @property {string} updateChannel             The current application update channel
 * @property {boolean} upnp                     Is UPNP activated?
 * @property {number} upnpLeaseDuration         The duration in seconds of a UPNP lease, if UPNP is active
 * @property {string} world                     A default world name which starts automatically on launch
 */
import DataModel from './abstract/data.d.mts';
import * as fields from './data/fields.d.mts';

export class ApplicationConfiguration extends DataModel {
  static defineSchema(): {
    adminPassword: fields.StringField;
    awsConfig: fields.StringField;
    compressStatic: fields.BooleanField;
    compressSocket: fields.BooleanField;
    cssTheme: fields.StringField;
    dataPath: fields.StringField;
    deleteNEDB: fields.BooleanField;
    fullscreen: fields.BooleanField;
    hostname: fields.StringField;
    hotReload: fields.BooleanField;
    language: fields.StringField;
    localHostname: fields.StringField;
    passwordSalt: fields.StringField;
    port: fields.NumberField;
    protocol: fields.NumberField;
    proxyPort: fields.NumberField;
    proxySSL: fields.BooleanField;
    routePrefix: fields.StringField;
    sslCert: fields.StringField;
    sslKey: fields.StringField;
    telemetry: fields.BooleanField;
    updateChannel: fields.StringField;
    upnp: fields.BooleanField;
    upnpLeaseDuration: fields.NumberField;
    world: fields.StringField;
    noBackups: fields.BooleanField;
  };
  /** @override */
  static override migrateData(data: any): any;
  /**
   * Validate a port assignment.
   * @param {number} port     The requested port
   * @throws                  An error if the requested port is invalid
   * @private
   */
  private static _validatePort;
}
/**
 * A data object which represents the details of this Release of Foundry VTT
 * @extends {DataModel}
 * @memberof config
 *
 * @property {number} generation        The major generation of the Release
 * @property {number} [maxGeneration]   The maximum available generation of the software.
 * @property {number} [maxStableGeneration]  The maximum available stable generation of the software.
 * @property {string} channel           The channel the Release belongs to, such as "stable"
 * @property {string} suffix            An optional appended string display for the Release
 * @property {number} build             The internal build number for the Release
 * @property {number} time              When the Release was released
 * @property {number} [node_version]    The minimum required Node.js major version
 * @property {string} [notes]           Release notes for the update version
 * @property {string} [download]        A temporary download URL where this version may be obtained
 */
export class ReleaseData extends DataModel {
  /** @override */
  static override defineSchema(): {
    generation: fields.NumberField;
    maxGeneration: fields.NumberField;
    maxStableGeneration: fields.NumberField;
    channel: fields.StringField;
    suffix: fields.StringField;
    build: fields.NumberField;
    time: fields.NumberField;
    node_version: fields.NumberField;
    notes: fields.StringField;
    download: fields.StringField;
  };
  /**
   * A formatted string for shortened display, such as "Version 9"
   * @return {string}
   */
  get shortDisplay(): string;
  /**
   * A formatted string for general display, such as "V9 Prototype 1" or "Version 9"
   * @return {string}
   */
  get display(): string;
  /**
   * A formatted string for Version compatibility checking, such as "9.150"
   * @return {string}
   */
  get version(): string;
  /**
   * Is this ReleaseData object newer than some other version?
   * @param {string|ReleaseData} other        Some other version to compare against
   * @returns {boolean}                       Is this ReleaseData a newer version?
   */
  isNewer(other: string | ReleaseData): boolean;
  /**
   * Is this ReleaseData object a newer generation than some other version?
   * @param {string|ReleaseData} other        Some other version to compare against
   * @returns {boolean}                       Is this ReleaseData a newer generation?
   */
  isGenerationalChange(other: string | ReleaseData): boolean;
}
