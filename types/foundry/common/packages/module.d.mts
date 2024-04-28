export { default as BaseWorld } from "./base-world.mjs";
export { default as BaseSystem } from "./base-system.mjs";
export { default as BaseModule } from "./base-module.mjs";
export type RelatedPackage = {
    /**
     * The id of the related package
     */
    id: string;
    /**
     * The type of the related package
     */
    type: string;
    /**
     * An explicit manifest URL, otherwise learned from the Foundry web server
     */
    manifest?: string;
    /**
     * The compatibility data with this related Package
     */
    compatibility?: PackageCompatibility;
    /**
     * The reason for this relationship
     */
    reason?: string;
};
export type PackageAuthorData = {
    /**
     * The author name
     */
    name: string;
    /**
     * The author email address
     */
    email?: string;
    /**
     * A website url for the author
     */
    url?: string;
    /**
     * A Discord username for the author
     */
    discord?: string;
};
export type PackageCompendiumData = {
    /**
     * The canonical compendium name. This should contain no spaces or special characters
     */
    name: string;
    /**
     * The human-readable compendium name
     */
    label: string;
    /**
     * The local relative path to the compendium source directory. The filename should match
     * the name attribute
     */
    path: string;
    /**
     * The specific document type that is contained within this compendium pack
     */
    type: string;
    /**
     * Denote that this compendium pack requires a specific game system to function properly
     */
    system?: string;
};
export type PackageLanguageData = {
    /**
     * A string language code which is validated by Intl.getCanonicalLocales
     */
    lang: string;
    /**
     * The human-readable language name
     */
    name: string;
    /**
     * The relative path to included JSON translation strings
     */
    path: string;
    /**
     * Only apply this set of translations when a specific system is being used
     */
    system?: string;
    /**
     * Only apply this set of translations when a specific module is active
     */
    module?: string;
};
/**
 * The data structure of a package manifest. This data structure is extended by BasePackage subclasses to add additional
 * type-specific fields.
 * [[include:full-manifest.md]]
 */
export type PackageManifestData = {
    /**
     * The machine-readable unique package id, should be lower-case with no spaces or special characters
     */
    id: string;
    /**
     * The human-readable package title, containing spaces and special characters
     */
    title: string;
    /**
     * An optional package description, may contain HTML
     */
    description?: string;
    /**
     * An array of author objects who are co-authors of this package. Preferred to the singular author field.
     */
    authors?: PackageAuthorData[];
    /**
     * A web url where more details about the package may be found
     */
    url?: string;
    /**
     * A web url or relative file path where license details may be found
     */
    license?: string;
    /**
     * A web url or relative file path where readme instructions may be found
     */
    readme?: string;
    /**
     * A web url where bug reports may be submitted and tracked
     */
    bugs?: string;
    /**
     * A web url where notes detailing package updates are available
     */
    changelog?: string;
    /**
     * The current package version
     */
    version: string;
    /**
     * The compatibility of this version with the core Foundry software
     */
    compatibility?: PackageCompatibility;
    /**
     * An array of urls or relative file paths for JavaScript files which should be included
     */
    scripts?: string[];
    /**
     * An array of urls or relative file paths for ESModule files which should be included
     */
    esmodules?: string[];
    /**
     * An array of urls or relative file paths for CSS stylesheet files which should be included
     */
    styles?: string[];
    /**
     * An array of language data objects which are included by this package
     */
    languages?: PackageLanguageData[];
    /**
     * An array of compendium packs which are included by this package
     */
    packs?: PackageCompendiumData[];
    /**
     * An organized object of relationships to other Packages
     */
    relationships?: PackageRelationships;
    /**
     * Whether to require a package-specific socket namespace for this package
     */
    socket?: boolean;
    /**
     * A publicly accessible web URL which provides the latest available package manifest file. Required in order to support module updates.
     */
    manifest?: string;
    /**
     * A publicly accessible web URL where the source files for this package may be downloaded. Required in order to support module installation.
     */
    download?: string;
    /**
     * Whether this package uses the protected content access system.
     */
    protected?: boolean;
};
export { default as BasePackage, PackageCompatibility, RelatedPackage } from "./base-package.mjs";
