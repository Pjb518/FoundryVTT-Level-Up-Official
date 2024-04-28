/** @module constants */
/**
 * The shortened software name
 * @type {string}
 */
export const vtt: string;
/**
 * The full software name
 * @type {string}
 */
export const VTT: string;
/**
 * The software website URL
 * @type {string}
 */
export const WEBSITE_URL: string;
/**
 * The serverless API URL
 */
export const WEBSITE_API_URL: "https://api.foundryvtt.com";
/**
 * An ASCII greeting displayed to the client
 * @type {string}
 */
export const ASCII: string;
/**
 * Define the allowed ActiveEffect application modes.
 */
export type ACTIVE_EFFECT_MODES = number;
export namespace ACTIVE_EFFECT_MODES {
    let CUSTOM: number;
    let MULTIPLY: number;
    let ADD: number;
    let DOWNGRADE: number;
    let UPGRADE: number;
    let OVERRIDE: number;
}
/**
 * Define the string name used for the base document type when specific sub-types are not defined by the system
 * @type {string}
 */
export const BASE_DOCUMENT_TYPE: string;
/**
 * Define the methods by which a Card can be drawn from a Cards stack
 */
export type CARD_DRAW_MODES = number;
export namespace CARD_DRAW_MODES {
    let FIRST: number;
    let TOP: number;
    let LAST: number;
    let BOTTOM: number;
    let RANDOM: number;
}
/**
 * An enumeration of canvas performance modes.
 */
export type CANVAS_PERFORMANCE_MODES = number;
export namespace CANVAS_PERFORMANCE_MODES {
    let LOW: number;
    let MED: number;
    let HIGH: number;
    let MAX: number;
}
/**
 * Valid Chat Message styles which affect how the message is presented in the chat log.
 */
export type CHAT_MESSAGE_STYLES = number;
export namespace CHAT_MESSAGE_STYLES {
    let OTHER: number;
    let OOC: number;
    let IC: number;
    let EMOTE: number;
}
/**
 * Define the set of languages which have built-in support in the core software
 * @type {string[]}
 */
export const CORE_SUPPORTED_LANGUAGES: string[];
/**
 * Configure the severity of compatibility warnings.
 */
export type COMPATIBILITY_MODES = number;
export namespace COMPATIBILITY_MODES {
    let SILENT: number;
    let WARNING: number;
    let ERROR: number;
    let FAILURE: number;
}
/**
 * The lighting illumination levels which are supported.
 */
export type LIGHTING_LEVELS = number;
export namespace LIGHTING_LEVELS {
    let DARKNESS: number;
    let HALFDARK: number;
    let UNLIT: number;
    let DIM: number;
    let BRIGHT: number;
    let BRIGHTEST: number;
}
/**
 * The CSS themes which are currently supported for the V11 Setup menu.
 */
export type CSS_THEMES = {
    id: string;
    label: string;
};
/**
 * The CSS themes which are currently supported for the V11 Setup menu.
 * @enum {{id: string, label: string}}
 */
export const CSS_THEMES: Readonly<{
    foundry: "THEME.foundry";
    fantasy: "THEME.fantasy";
    scifi: "THEME.scifi";
}>;
/**
 * The default artwork used for Token images if none is provided
 * @type {string}
 */
export const DEFAULT_TOKEN: string;
/**
 * The primary Document types.
 * @type {string[]}
 */
export const PRIMARY_DOCUMENT_TYPES: string[];
/**
 * The embedded Document types.
 * @type {Readonly<string[]>}
 */
export const EMBEDDED_DOCUMENT_TYPES: Readonly<string[]>;
/**
 * A listing of all valid Document types, both primary and embedded.
 * @type {Readonly<string[]>}
 */
export const ALL_DOCUMENT_TYPES: Readonly<string[]>;
/**
 * The allowed primary Document types which may exist within a World.
 * @type {string[]}
 */
export const WORLD_DOCUMENT_TYPES: string[];
/**
 * The allowed primary Document types which may exist within a Compendium pack.
 * @type {string[]}
 */
export const COMPENDIUM_DOCUMENT_TYPES: string[];
/**
 * *
 */
export type DOCUMENT_OWNERSHIP_LEVELS = number;
export namespace DOCUMENT_OWNERSHIP_LEVELS {
    let INHERIT: number;
    let NONE: number;
    let LIMITED: number;
    let OBSERVER: number;
    let OWNER: number;
}
/**
 * Meta ownership levels that are used in the UI but never stored.
 */
export type DOCUMENT_META_OWNERSHIP_LEVELS = number;
export namespace DOCUMENT_META_OWNERSHIP_LEVELS {
    let DEFAULT: number;
    let NOCHANGE: number;
}
/**
 * Define the allowed Document types which may be dynamically linked in chat
 * @type {string[]}
 */
export const DOCUMENT_LINK_TYPES: string[];
/**
 * *
 */
export type DICE_ROLL_MODES = string;
export namespace DICE_ROLL_MODES {
    let PUBLIC: string;
    let PRIVATE: string;
    let BLIND: string;
    let SELF: string;
}
/**
 * *
 */
export type DRAWING_FILL_TYPES = number;
export namespace DRAWING_FILL_TYPES {
    let NONE_1: number;
    export { NONE_1 as NONE };
    export let SOLID: number;
    export let PATTERN: number;
}
/**
 * Define the allowed Document types which Folders may contain
 * @type {string[]}
 */
export const FOLDER_DOCUMENT_TYPES: string[];
/**
 * The maximum allowed level of depth for Folder nesting
 * @type {number}
 */
export const FOLDER_MAX_DEPTH: number;
/**
 * A list of allowed game URL names
 * @type {string[]}
 */
export const GAME_VIEWS: string[];
/**
 * The directions of movement.
 */
export type MOVEMENT_DIRECTIONS = number;
export namespace MOVEMENT_DIRECTIONS {
    let UP: number;
    let DOWN: number;
    let LEFT: number;
    let RIGHT: number;
    let UP_LEFT: number;
    let UP_RIGHT: number;
    let DOWN_LEFT: number;
    let DOWN_RIGHT: number;
}
/**
 * The minimum allowed grid size which is supported by the software
 * @type {number}
 */
export const GRID_MIN_SIZE: number;
/**
 * *
 */
export type GRID_TYPES = number;
export namespace GRID_TYPES {
    let GRIDLESS: number;
    let SQUARE: number;
    let HEXODDR: number;
    let HEXEVENR: number;
    let HEXODDQ: number;
    let HEXEVENQ: number;
}
/**
 * The different rules to define and measure diagonal distance/cost in a square grid.
 * The description of each option refers to the distance/cost of moving diagonally relative to the distance/cost of a horizontal or vertical move.
 */
export type GRID_DIAGONALS = number;
export namespace GRID_DIAGONALS {
    let EQUIDISTANT: number;
    let EXACT: number;
    let APPROXIMATE: number;
    let RECTILINEAR: number;
    let ALTERNATING_1: number;
    let ALTERNATING_2: number;
    let ILLEGAL: number;
}
/**
 * The grid snapping modes.
 */
export type GRID_SNAPPING_MODES = number;
export namespace GRID_SNAPPING_MODES {
    let CENTER: number;
    let EDGE_MIDPOINT: number;
    let TOP_LEFT_VERTEX: number;
    let TOP_RIGHT_VERTEX: number;
    let BOTTOM_LEFT_VERTEX: number;
    let BOTTOM_RIGHT_VERTEX: number;
    let VERTEX: number;
    let TOP_LEFT_CORNER: number;
    let TOP_RIGHT_CORNER: number;
    let BOTTOM_LEFT_CORNER: number;
    let BOTTOM_RIGHT_CORNER: number;
    let CORNER: number;
    let TOP_SIDE_MIDPOINT: number;
    let BOTTOM_SIDE_MIDPOINT: number;
    let LEFT_SIDE_MIDPOINT: number;
    let RIGHT_SIDE_MIDPOINT: number;
    let SIDE_MIDPOINT: number;
}
/**
 * A list of supported setup URL names
 * @type {string[]}
 */
export const SETUP_VIEWS: string[];
/**
 * An Array of valid MacroAction scope values
 * @type {string[]}
 */
export const MACRO_SCOPES: string[];
/**
 * *
 */
export type MACRO_TYPES = string;
export namespace MACRO_TYPES {
    let SCRIPT: string;
    let CHAT: string;
}
/**
 * The allowed channels for audio playback.
 */
export type AUDIO_CHANNELS = string;
export namespace AUDIO_CHANNELS {
    export let music: string;
    export let environment: string;
    let _interface: string;
    export { _interface as interface };
}
/**
 * *
 */
export type PLAYLIST_MODES = number;
export namespace PLAYLIST_MODES {
    let DISABLED: number;
    let SEQUENTIAL: number;
    let SHUFFLE: number;
    let SIMULTANEOUS: number;
}
/**
 * *
 */
export type PLAYLIST_SORT_MODES = string;
export namespace PLAYLIST_SORT_MODES {
    let ALPHABETICAL: string;
    let MANUAL: string;
}
/**
 * The available modes for searching within a DirectoryCollection
 * @type {{FULL: string, NAME: string}}
 */
export const DIRECTORY_SEARCH_MODES: {
    FULL: string;
    NAME: string;
};
/**
 * The allowed package types
 * @type {string[]}
 */
export const PACKAGE_TYPES: string[];
/**
 * Encode the reasons why a package may be available or unavailable for use
 */
export type PACKAGE_AVAILABILITY_CODES = number;
export namespace PACKAGE_AVAILABILITY_CODES {
    let UNKNOWN: number;
    let VERIFIED: number;
    let UNVERIFIED_BUILD: number;
    let UNVERIFIED_SYSTEM: number;
    let UNVERIFIED_GENERATION: number;
    let MISSING_SYSTEM: number;
    let MISSING_DEPENDENCY: number;
    let REQUIRES_CORE_DOWNGRADE: number;
    let REQUIRES_CORE_UPGRADE_STABLE: number;
    let REQUIRES_CORE_UPGRADE_UNSTABLE: number;
    let REQUIRES_DEPENDENCY_UPDATE: number;
}
/**
 * A safe password string which can be displayed
 * @type {string}
 */
export const PASSWORD_SAFE_STRING: string;
/**
 * The allowed software update channels
 */
export type SOFTWARE_UPDATE_CHANNELS = string;
export namespace SOFTWARE_UPDATE_CHANNELS {
    let stable: string;
    let testing: string;
    let development: string;
}
/**
 * The default sorting density for manually ordering child objects within a parent
 * @type {number}
 */
export const SORT_INTEGER_DENSITY: number;
/**
 * *
 */
export type TABLE_RESULT_TYPES = string;
export namespace TABLE_RESULT_TYPES {
    let TEXT: string;
    let DOCUMENT: string;
    let COMPENDIUM: string;
}
/**
 * *
 */
export type JOURNAL_ENTRY_PAGE_FORMATS = number;
export namespace JOURNAL_ENTRY_PAGE_FORMATS {
    let HTML: number;
    let MARKDOWN: number;
}
/**
 * *
 */
export type TEXT_ANCHOR_POINTS = number;
export namespace TEXT_ANCHOR_POINTS {
    let CENTER_1: number;
    export { CENTER_1 as CENTER };
    let BOTTOM_1: number;
    export { BOTTOM_1 as BOTTOM };
    let TOP_1: number;
    export { TOP_1 as TOP };
    let LEFT_1: number;
    export { LEFT_1 as LEFT };
    let RIGHT_1: number;
    export { RIGHT_1 as RIGHT };
}
/**
 * *
 */
export type OCCLUSION_MODES = number;
export namespace OCCLUSION_MODES {
    let NONE_2: number;
    export { NONE_2 as NONE };
    export let FADE: number;
    export let RADIAL: number;
    export let VISION: number;
}
export namespace TILE_OCCLUSION_MODES { }
/**
 * The occlusion modes that define the set of tokens that trigger occlusion.
 */
export type TOKEN_OCCLUSION_MODES = number;
export namespace TOKEN_OCCLUSION_MODES {
    let OWNED: number;
    let CONTROLLED: number;
    let HOVERED: number;
    let HIGHLIGHTED: number;
    let VISIBLE: number;
}
/**
 * *
 */
export type TOKEN_DISPLAY_MODES = number;
export namespace TOKEN_DISPLAY_MODES {
    let NONE_3: number;
    export { NONE_3 as NONE };
    export let CONTROL: number;
    export let OWNER_HOVER: number;
    export let HOVER: number;
    let OWNER_1: number;
    export { OWNER_1 as OWNER };
    export let ALWAYS: number;
}
/**
 * *
 */
export type TOKEN_DISPOSITIONS = number;
export namespace TOKEN_DISPOSITIONS {
    let SECRET: number;
    let HOSTILE: number;
    let NEUTRAL: number;
    let FRIENDLY: number;
}
/**
 * The possible shapes of Tokens in hexagonal grids.
 */
export type TOKEN_HEXAGONAL_SHAPES = number;
export namespace TOKEN_HEXAGONAL_SHAPES {
    let ELLIPSE_1: number;
    let ELLIPSE_2: number;
    let TRAPEZOID_1: number;
    let TRAPEZOID_2: number;
    let RECTANGLE_1: number;
    let RECTANGLE_2: number;
}
/**
 * *
 */
export type USER_ROLES = number;
export namespace USER_ROLES {
    let NONE_4: number;
    export { NONE_4 as NONE };
    export let PLAYER: number;
    export let TRUSTED: number;
    export let ASSISTANT: number;
    export let GAMEMASTER: number;
}
/**
 * *
 */
export type USER_ROLE_NAMES = string;
/**
 * Invert the User Role mapping to recover role names from a role integer
 * @enum {string}
 * @see USER_ROLES
 */
export const USER_ROLE_NAMES: {};
/**
 * *
 */
export type MEASURED_TEMPLATE_TYPES = string;
export namespace MEASURED_TEMPLATE_TYPES {
    let CIRCLE: string;
    let CONE: string;
    let RECTANGLE: string;
    let RAY: string;
}
/**
 * @typedef {Object} UserPermission
 * @property {string} label
 * @property {string} hint
 * @property {boolean} disableGM
 * @property {number} defaultRole
 */
/**
 * Define the recognized User capabilities which individual Users or role levels may be permitted to perform
 * @type {Object<UserPermission>}
 */
export const USER_PERMISSIONS: any;
/**
 * *
 */
export type WALL_DIRECTIONS = number;
export namespace WALL_DIRECTIONS {
    export let BOTH: number;
    let LEFT_2: number;
    export { LEFT_2 as LEFT };
    let RIGHT_2: number;
    export { RIGHT_2 as RIGHT };
}
/**
 * *
 */
export type WALL_DOOR_TYPES = number;
export namespace WALL_DOOR_TYPES {
    let NONE_5: number;
    export { NONE_5 as NONE };
    export let DOOR: number;
    let SECRET_1: number;
    export { SECRET_1 as SECRET };
}
/**
 * *
 */
export type WALL_DOOR_STATES = number;
export namespace WALL_DOOR_STATES {
    let CLOSED: number;
    let OPEN: number;
    let LOCKED: number;
}
/**
 * The possible ways to interact with a door
 */
export type WALL_DOOR_INTERACTIONS = string[];
/**
 * The possible ways to interact with a door
 * @enum {string[]}
 */
export const WALL_DOOR_INTERACTIONS: string[];
/**
 * The wall properties which restrict the way interaction occurs with a specific wall
 * @type {string[]}
 */
export const WALL_RESTRICTION_TYPES: string[];
/**
 * *
 */
export type WALL_SENSE_TYPES = number;
export namespace WALL_SENSE_TYPES {
    let NONE_6: number;
    export { NONE_6 as NONE };
    let LIMITED_1: number;
    export { LIMITED_1 as LIMITED };
    export let NORMAL: number;
    export let PROXIMITY: number;
    export let DISTANCE: number;
}
/**
 * *
 */
export type WALL_MOVEMENT_TYPES = number;
export namespace WALL_MOVEMENT_TYPES {
    import NONE_7 = WALL_SENSE_TYPES.NONE;
    export { NONE_7 as NONE };
    import NORMAL_1 = WALL_SENSE_TYPES.NORMAL;
    export { NORMAL_1 as NORMAL };
}
/**
 * *
 */
export type KEYBINDING_PRECEDENCE = number;
export namespace KEYBINDING_PRECEDENCE {
    export let PRIORITY: number;
    let NORMAL_2: number;
    export { NORMAL_2 as NORMAL };
    export let DEFERRED: number;
}
/**
 * The allowed set of HTML template extensions
 * @type {string[]}
 */
export const HTML_FILE_EXTENSIONS: string[];
/**
 * The supported file extensions for image-type files, and their corresponding mime types.
 * @type {Object<string, string>}
 */
export const IMAGE_FILE_EXTENSIONS: {
    [x: string]: string;
};
/**
 * The supported file extensions for video-type files, and their corresponding mime types.
 * @type {Object<string, string>}
 */
export const VIDEO_FILE_EXTENSIONS: {
    [x: string]: string;
};
/**
 * The supported file extensions for audio-type files, and their corresponding mime types.
 * @type {Object<string, string>}
 */
export const AUDIO_FILE_EXTENSIONS: {
    [x: string]: string;
};
/**
 * The supported file extensions for text files, and their corresponding mime types.
 * @type {Object<string, string>}
 */
export const TEXT_FILE_EXTENSIONS: {
    [x: string]: string;
};
/**
 * Supported file extensions for font files, and their corresponding mime types.
 * @type {Object<string, string>}
 */
export const FONT_FILE_EXTENSIONS: {
    [x: string]: string;
};
/**
 * Supported file extensions for 3D files, and their corresponding mime types.
 * @type {Object<string, string>}
 */
export const GRAPHICS_FILE_EXTENSIONS: {
    [x: string]: string;
};
/**
 * A consolidated mapping of all extensions permitted for upload.
 * @type {Object<string, string>}
 */
export const UPLOADABLE_FILE_EXTENSIONS: {
    [x: string]: string;
};
/**
 * A list of MIME types which are treated as uploaded "media", which are allowed to overwrite existing files.
 * Any non-media MIME type is not allowed to replace an existing file.
 * @type {string[]}
 */
export const MEDIA_MIME_TYPES: string[];
/**
 * An enumeration of file type categories which can be selected
 */
export type FILE_CATEGORIES = {
    [x: string]: string;
};
export namespace FILE_CATEGORIES {
    export { HTML_FILE_EXTENSIONS as HTML };
    export { IMAGE_FILE_EXTENSIONS as IMAGE };
    export { VIDEO_FILE_EXTENSIONS as VIDEO };
    export { AUDIO_FILE_EXTENSIONS as AUDIO };
    export { TEXT_FILE_EXTENSIONS as TEXT };
    export { FONT_FILE_EXTENSIONS as FONT };
    export { GRAPHICS_FILE_EXTENSIONS as GRAPHICS };
    export { MEDIA_MIME_TYPES as MEDIA };
}
/**
 * A font weight to name mapping.
 */
export type FONT_WEIGHTS = number;
export namespace FONT_WEIGHTS {
    let Thin: number;
    let ExtraLight: number;
    let Light: number;
    let Regular: number;
    let Medium: number;
    let SemiBold: number;
    let Bold: number;
    let ExtraBold: number;
    let Black: number;
}
/**
 * Stores shared commonly used timeouts, measured in MS
 */
export type TIMEOUTS = number;
export namespace TIMEOUTS {
    let FOUNDRY_WEBSITE: number;
    let PACKAGE_REPOSITORY: number;
    let IP_DISCOVERY: number;
}
/**
 * A subset of Compendium types which require a specific system to be designated
 * @type {string[]}
 */
export const SYSTEM_SPECIFIC_COMPENDIUM_TYPES: string[];
/**
 * The configured showdown bi-directional HTML <-> Markdown converter options.
 * @type {Object<boolean>}
 */
export const SHOWDOWN_OPTIONS: any;
/**
 * The list of allowed attributes in HTML elements.
 * @type {Record<string, string[]>}
 */
export const ALLOWED_HTML_ATTRIBUTES: Record<string, string[]>;
/**
 * The list of trusted iframe domains.
 * @type {string[]}
 */
export const TRUSTED_IFRAME_DOMAINS: string[];
/**
 * Available themes for the world join page.
 */
export type WORLD_JOIN_THEMES = string;
export namespace WORLD_JOIN_THEMES {
    let _default: string;
    export { _default as default };
    export let minimal: string;
}
/**
 * Setup page package progress protocol.
 * @type {{ACTIONS: Object<string>, STEPS: Object<string>}}
 */
export const SETUP_PACKAGE_PROGRESS: {
    ACTIONS: any;
    STEPS: any;
};
/**
 * The combat announcements.
 * @type {string[]}
 */
export const COMBAT_ANNOUNCEMENTS: string[];
/**
 * The fit modes of {@link foundry.data.TextureData#fit}.
 * @type {string[]}
 */
export const TEXTURE_DATA_FIT_MODES: string[];
/**
 * The maximum depth to recurse to when embedding enriched text.
 * @type {number}
 */
export const TEXT_ENRICH_EMBED_MAX_DEPTH: number;
/**
 * The Region events that are supported by core.
 */
export type REGION_EVENTS = string;
export namespace REGION_EVENTS {
    let REGION_BOUNDARY: string;
    let BEHAVIOR_STATUS: string;
    let TOKEN_ENTER: string;
    let TOKEN_EXIT: string;
    let TOKEN_MOVE: string;
    let TOKEN_PRE_MOVE: string;
    let TOKEN_TURN_START: string;
    let TOKEN_TURN_END: string;
    let TOKEN_ROUND_START: string;
    let TOKEN_ROUND_END: string;
}
export namespace CHAT_MESSAGE_TYPES { }
/**
 * @deprecated since v12
 * @ignore
 */
export const DOCUMENT_TYPES: readonly string[];
export type UserPermission = {
    label: string;
    hint: string;
    disableGM: boolean;
    defaultRole: number;
};
