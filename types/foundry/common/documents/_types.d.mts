export type ActiveEffectData = {
  /**
   * The _id that uniquely identifies the ActiveEffect within its parent collection
   */
  _id: string;
  /**
   * The name of the which describes the name of the ActiveEffect
   */
  name: string;
  /**
   * An image path used to depict the ActiveEffect as an icon
   */
  img: string;
  /**
   * The array of EffectChangeData objects which the ActiveEffect applies
   */
  changes: EffectChangeData[];
  /**
   * Is this ActiveEffect currently disabled?
   */
  disabled?: boolean;
  /**
   * An EffectDurationData object which describes the duration of the ActiveEffect
   */
  duration?: EffectDurationData;
  /**
   * The HTML text description for this ActiveEffect document.
   */
  description?: string;
  /**
   * A UUID reference to the document from which this ActiveEffect originated
   */
  origin?: string;
  /**
   * A color string which applies a tint to the ActiveEffect icon
   */
  tint?: string;
  /**
   * Does this ActiveEffect automatically transfer from an Item to an Actor?
   */
  transfer?: boolean;
  /**
   * Special status IDs that pertain to this effect
   */
  statuses?: Set<string>;
  /**
   * An object of optional key/value flags
   */
  flags: object;
};
export type EffectDurationData = {
  /**
   * The world time when the active effect first started
   */
  startTime?: number;
  /**
   * The maximum duration of the effect, in seconds
   */
  seconds?: number;
  /**
   * The _id of the CombatEncounter in which the effect first started
   */
  combat?: string;
  /**
   * The maximum duration of the effect, in combat rounds
   */
  rounds?: number;
  /**
   * The maximum duration of the effect, in combat turns
   */
  turns?: number;
  /**
   * The round of the CombatEncounter in which the effect first started
   */
  startRound?: number;
  /**
   * The turn of the CombatEncounter in which the effect first started
   */
  startTurn?: number;
};
export type EffectChangeData = {
  /**
   * The attribute path in the Actor or Item data which the change modifies
   */
  key: string;
  /**
   * The value of the change effect
   */
  value: string;
  /**
   * The modification mode with which the change is applied
   */
  mode: number;
  /**
   * The priority level with which this change is applied
   */
  priority: number;
};
export type ActorData = {
  /**
   * The _id which uniquely identifies this Actor document
   */
  _id: string;
  /**
   * The name of this Actor
   */
  name: string;
  /**
   * An Actor subtype which configures the system data model applied
   */
  type: string;
  /**
   * An image file path which provides the artwork for this Actor
   */
  img?: string;
  /**
   * The system data object which is defined by the system template.json model
   */
  system?: object;
  /**
   * Default Token settings which are used for Tokens created from
   * this Actor
   */
  prototypeToken?: data.PrototypeToken;
  /**
   * A Collection of Item embedded Documents
   */
  items: Collection<documents.BaseItem>;
  /**
   * A Collection of ActiveEffect embedded Documents
   */
  effects: Collection<documents.BaseActiveEffect>;
  /**
   * The _id of a Folder which contains this Actor
   */
  folder: string | null;
  /**
   * The numeric sort value which orders this Actor relative to its siblings
   */
  sort?: number;
  /**
   * An object which configures ownership of this Actor
   */
  ownership?: object;
  /**
   * An object of optional key/value flags
   */
  flags: object;
  /**
   * An object of creation and access information
   */
  _stats: DocumentStats;
};
export type ActorDeltaData = {
  /**
   * The _id which uniquely identifies this ActorDelta document
   */
  _id: string;
  /**
   * The name override, if any.
   */
  name?: string;
  /**
   * The type override, if any.
   */
  type?: string;
  /**
   * The image override, if any.
   */
  img?: string;
  /**
   * The system data model override.
   */
  system?: object;
  /**
   * An array of embedded item data overrides.
   */
  items?: Collection<BaseItem>;
  /**
   * An array of embedded active effect data overrides.
   */
  effects?: Collection<BaseActiveEffect>;
  /**
   * Ownership overrides.
   */
  ownership?: object;
  /**
   * An object of optional key/value flags
   */
  flags: object;
};
export type AdventureData = {
  /**
   * The _id which uniquely identifies this Adventure document
   */
  _id: string;
  /**
   * The human-readable name of the Adventure
   */
  name: string;
  /**
   * The file path for the primary image of the adventure
   */
  img: string;
  /**
   * A string caption displayed under the primary image banner
   */
  caption: string;
  /**
   * An HTML text description for the adventure
   */
  description: string;
  /**
   * An array of included Actor documents
   */
  actors: foundry.documents.BaseActor[];
  /**
   * An array of included Combat documents
   */
  combats: foundry.documents.BaseCombat[];
  /**
   * An array of included Item documents
   */
  items: foundry.documents.BaseItem[];
  /**
   * An array of included Scene documents
   */
  scenes: foundry.documents.BaseScene[];
  /**
   * An array of included JournalEntry documents
   */
  journal: foundry.documents.BaseJournalEntry[];
  /**
   * An array of included RollTable documents
   */
  tables: foundry.documents.BaseRollTable[];
  /**
   * An array of included Macro documents
   */
  macros: foundry.documents.BaseMacro[];
  /**
   * An array of included Cards documents
   */
  cards: foundry.documents.BaseCards[];
  /**
   * An array of included Playlist documents
   */
  playlists: foundry.documents.BasePlaylist[];
  /**
   * An array of included Folder documents
   */
  folders: foundry.documents.BaseFolder[];
  /**
   * The sort order of this adventure relative to its siblings
   */
  sort: number;
  /**
   * An object of optional key/value flags
   */
  flags: object;
  /**
   * An object of creation and access information
   */
  _stats: DocumentStats;
};
export type AmbientLightData = {
  /**
   * The _id which uniquely identifies this AmbientLight document
   */
  _id: string;
  /**
   * The x-coordinate position of the origin of the light
   */
  x: number;
  /**
   * The y-coordinate position of the origin of the light
   */
  y: number;
  /**
   * The angle of rotation for the tile between 0 and 360
   */
  rotation?: number;
  /**
   * Whether or not this light source is constrained by Walls
   */
  walls?: boolean;
  /**
   * Whether or not this light source provides a source of vision
   */
  vision?: boolean;
  /**
   * Light configuration data
   */
  config: LightData;
  /**
   * Is the light source currently hidden?
   */
  hidden?: boolean;
  /**
   * An object of optional key/value flags
   */
  flags: object;
};
export type AmbientSoundData = {
  /**
   * The _id which uniquely identifies this AmbientSound document
   */
  _id: string;
  /**
   * The x-coordinate position of the origin of the sound.
   */
  x: number;
  /**
   * The y-coordinate position of the origin of the sound.
   */
  y: number;
  /**
   * The radius of the emitted sound.
   */
  radius: number;
  /**
   * The audio file path that is played by this sound
   */
  path: string;
  /**
   * Does this sound loop?
   */
  repeat?: boolean;
  /**
   * The audio volume of the sound, from 0 to 1
   */
  volume?: number;
  /**
   * Whether or not this sound source is constrained by Walls. True by default.
   */
  walls: boolean;
  /**
   * Whether to adjust the volume of the sound heard by the listener based on how
   * close the listener is to the center of the sound source. True by default.
   */
  easing: boolean;
  /**
   * Is the sound source currently hidden? False by default.
   */
  hidden: boolean;
  /**
   * A darkness range (min and max) for which the source should be active
   */
  darkness: {
    min: number;
    max: number;
  };
  /**
   * Special effects to apply to the sound
   */
  effects: {
    base: AmbientSoundEffect;
    muffled: AmbientSoundEffect;
  };
  /**
   * An object of optional key/value flags
   */
  flags: object;
};
export type AmbientSoundEffect = any;
export type CardData = {
  /**
   * The _id which uniquely identifies this Card document
   */
  _id: string;
  /**
   * The text name of this card
   */
  name: string;
  /**
   * A text description of this card which applies to all faces
   */
  description?: string;
  /**
   * A category of card (for example, a suit) to which this card belongs
   */
  type: string;
  /**
   * Game system data which is defined by the system template.json model
   */
  system?: object;
  /**
   * An optional suit designation which is used by default sorting
   */
  suit?: string;
  /**
   * An optional numeric value of the card which is used by default sorting
   */
  value?: number;
  /**
   * An object of face data which describes the back of this card
   */
  back: CardFaceData;
  /**
   * An array of face data which represent displayable faces of this card
   */
  faces: CardFaceData[];
  /**
   * The index of the currently displayed face, or null if the card is face-down
   */
  face: number | null;
  /**
   * Whether this card is currently drawn from its source deck
   */
  drawn: boolean;
  /**
   * The document ID of the origin deck to which this card belongs
   */
  origin: string;
  /**
   * The visible width of this card
   */
  width: number;
  /**
   * The visible height of this card
   */
  height: number;
  /**
   * The angle of rotation of this card
   */
  rotation: number;
  /**
   * The sort order of this card relative to others in the same stack
   */
  sort: number;
  /**
   * An object of optional key/value flags
   */
  flags: object;
};
export type CardFaceData = {
  /**
   * A name for this card face
   */
  name?: string;
  /**
   * Displayed text that belongs to this face
   */
  text?: string;
  /**
   * A displayed image or video file which depicts the face
   */
  img?: string;
};
export type CardsData = {
  /**
   * The _id which uniquely identifies this stack of Cards document
   */
  _id: string;
  /**
   * The text name of this stack
   */
  name: string;
  /**
   * The type of this stack, in BaseCards.metadata.types
   */
  type: string;
  /**
   * Game system data which is defined by the system template.json model
   */
  system?: object;
  /**
   * A text description of this stack
   */
  description?: string;
  /**
   * An image or video which is used to represent the stack of cards
   */
  img?: string;
  /**
   * A collection of Card documents which currently belong to this stack
   */
  cards: Collection<BaseCard>;
  /**
   * The visible width of this stack
   */
  width: number;
  /**
   * The visible height of this stack
   */
  height: number;
  /**
   * The angle of rotation of this stack
   */
  rotation: number;
  /**
   * Whether or not to publicly display the number of cards in this stack
   */
  displayCount?: boolean;
  /**
   * The _id of a Folder which contains this document
   */
  folder: string | null;
  /**
   * The sort order of this stack relative to others in its parent collection
   */
  sort: number;
  /**
   * An object which configures ownership of this Cards
   */
  ownership?: object;
  /**
   * An object of optional key/value flags
   */
  flags: object;
  /**
   * An object of creation and access information
   */
  _stats: DocumentStats;
};
export type ChatMessageData = {
  /**
   * The _id which uniquely identifies this ChatMessage document
   */
  _id: string;
  /**
   * The message type from CONST.CHAT_MESSAGE_STYLES
   */
  type?: number;
  /**
   * The _id of the User document who generated this message
   */
  user: string;
  /**
   * The timestamp at which point this message was generated
   */
  timestamp: number;
  /**
   * An optional flavor text message which summarizes this message
   */
  flavor?: string;
  /**
   * The HTML content of this chat message
   */
  content: string;
  /**
   * A ChatSpeakerData object which describes the origin of the ChatMessage
   */
  speaker: ChatSpeakerData;
  /**
   * An array of User _id values to whom this message is privately whispered
   */
  whisper: string[];
  /**
   * Is this message sent blindly where the creating User cannot see it?
   */
  blind?: boolean;
  /**
   * Serialized content of any Roll instances attached to the ChatMessage
   */
  rolls?: string[];
  /**
   * The URL of an audio file which plays when this message is received
   */
  sound?: string;
  /**
   * Is this message styled as an emote?
   */
  emote?: boolean;
  /**
   * An object of optional key/value flags
   */
  flags: object;
  /**
   * An object of creation and access information
   */
  _stats: DocumentStats;
};
export type ChatSpeakerData = {
  /**
   * The _id of the Scene where this message was created
   */
  scene?: string;
  /**
   * The _id of the Actor who generated this message
   */
  actor?: string;
  /**
   * The _id of the Token who generated this message
   */
  token?: string;
  /**
   * An overridden alias name used instead of the Actor or Token name
   */
  alias?: string;
};
export type CombatData = {
  /**
   * The _id which uniquely identifies this Combat document
   */
  _id: string;
  /**
   * The _id of a Scene within which this Combat occurs
   */
  scene: string;
  /**
   * A Collection of Combatant embedded Documents
   */
  combatants: Collection<BaseCombatant>;
  /**
   * Is the Combat encounter currently active?
   */
  active?: boolean;
  /**
   * The current round of the Combat encounter
   */
  round?: number;
  /**
   * The current turn in the Combat round
   */
  turn?: number | null;
  /**
   * The current sort order of this Combat relative to others in the same Scene
   */
  sort?: number;
  /**
   * An object of optional key/value flags
   */
  flags: object;
  /**
   * An object of creation and access information
   */
  _stats: DocumentStats;
};
export type CombatantData = {
  /**
   * The _id which uniquely identifies this Combatant embedded document
   */
  _id: string;
  /**
   * The _id of an Actor associated with this Combatant
   */
  actorId?: string;
  /**
   * The _id of a Token associated with this Combatant
   */
  tokenId?: string;
  /**
   * A customized name which replaces the name of the Token in the tracker
   */
  name?: string;
  /**
   * A customized image which replaces the Token image in the tracker
   */
  img?: string;
  /**
   * The initiative score for the Combatant which determines its turn order
   */
  initiative?: number;
  /**
   * Is this Combatant currently hidden?
   */
  hidden?: boolean;
  /**
   * Has this Combatant been defeated?
   */
  defeated?: boolean;
  /**
   * An object of optional key/value flags
   */
  flags: object;
};
export type DrawingData = {
  /**
   * The _id which uniquely identifies this BaseDrawing embedded document
   */
  _id: string;
  /**
   * The _id of the user who created the drawing
   */
  author: string;
  /**
   * The geometric shape of the drawing
   */
  shape: data.ShapeData;
  /**
   * The x-coordinate position of the top-left corner of the drawn shape
   */
  x: number;
  /**
   * The y-coordinate position of the top-left corner of the drawn shape
   */
  y: number;
  /**
   * The elevation of the drawing
   */
  elevation?: number;
  /**
   * The z-index of this drawing relative to other siblings
   */
  sort?: number;
  /**
   * The angle of rotation for the drawing figure
   */
  rotation?: number;
  /**
   * An amount of bezier smoothing applied, between 0 and 1
   */
  bezierFactor?: number;
  /**
   * The fill type of the drawing shape, a value from CONST.DRAWING_FILL_TYPES
   */
  fillType?: number;
  /**
   * An optional color string with which to fill the drawing geometry
   */
  fillColor?: string;
  /**
   * The opacity of the fill applied to the drawing geometry
   */
  fillAlpha?: number;
  /**
   * The width in pixels of the boundary lines of the drawing geometry
   */
  strokeWidth?: number;
  /**
   * The color of the boundary lines of the drawing geometry
   */
  strokeColor?: number;
  /**
   * The opacity of the boundary lines of the drawing geometry
   */
  strokeAlpha?: number;
  /**
   * The path to a tiling image texture used to fill the drawing geometry
   */
  texture?: string;
  /**
   * Optional text which is displayed overtop of the drawing
   */
  text?: string;
  /**
   * The font family used to display text within this drawing, defaults to
   *         CONFIG.defaultFontFamily
   */
  fontFamily?: string;
  /**
   * The font size used to display text within this drawing
   */
  fontSize?: number;
  /**
   * The color of text displayed within this drawing
   */
  textColor?: string;
  /**
   * The opacity of text displayed within this drawing
   */
  textAlpha?: number;
  /**
   * Is the drawing currently hidden?
   */
  hidden?: boolean;
  /**
   * Is the drawing currently locked?
   */
  locked?: boolean;
  /**
   * An object of optional key/value flags
   */
  flags: object;
};
export type FogExplorationData = {
  /**
   * The _id which uniquely identifies this FogExploration document
   */
  _id: string;
  /**
   * The _id of the Scene document to which this fog applies
   */
  scene: string;
  /**
   * The _id of the User document to which this fog applies
   */
  user: string;
  /**
   * The base64 image/jpeg of the explored fog polygon
   */
  explored: string;
  /**
   * The object of scene positions which have been explored at a certain vision radius
   */
  positions: object;
  /**
   * The timestamp at which this fog exploration was last updated
   */
  timestamp: number;
  /**
   * An object of optional key/value flags
   */
  flags: object;
};
export type FolderData = {
  /**
   * The _id which uniquely identifies this Folder document
   */
  _id: string;
  /**
   * The name of this Folder
   */
  name: string;
  /**
   * The document type which this Folder contains, from CONST.FOLDER_DOCUMENT_TYPES
   */
  type: string;
  /**
   * An HTML description of the contents of this folder
   */
  description: string;
  /**
   * The _id of a parent Folder which contains this Folder
   */
  folder?: string | null;
  /**
   * The sorting mode used to organize documents within this Folder, in ["a", "m"]
   */
  sorting?: string;
  /**
   * The numeric sort value which orders this Folder relative to its siblings
   */
  sort?: number;
  /**
   * A color string used for the background color of this Folder
   */
  color?: string | null;
  /**
   * An object of optional key/value flags
   */
  flags: object;
  /**
   * An object of creation and access information
   */
  _stats: DocumentStats;
};
export type ItemData = {
  /**
   * The _id which uniquely identifies this Item document
   */
  _id: string;
  /**
   * The name of this Item
   */
  name: string;
  /**
   * An Item subtype which configures the system data model applied
   */
  type: string;
  /**
   * An image file path which provides the artwork for this Item
   */
  img?: string;
  /**
   * The system data object which is defined by the system template.json model
   */
  system?: object;
  /**
   * A collection of ActiveEffect embedded Documents
   */
  effects: Collection<BaseActiveEffect>;
  /**
   * The _id of a Folder which contains this Item
   */
  folder: string | null;
  /**
   * The numeric sort value which orders this Item relative to its siblings
   */
  sort?: number;
  /**
   * An object which configures ownership of this Item
   */
  ownership?: object;
  /**
   * An object of optional key/value flags
   */
  flags: object;
  /**
   * An object of creation and access information
   */
  _stats: DocumentStats;
};
export type JournalEntryData = {
  /**
   * The _id which uniquely identifies this JournalEntry document
   */
  _id: string;
  /**
   * The name of this JournalEntry
   */
  name: string;
  /**
   * The pages contained within this JournalEntry document
   */
  pages: JournalEntryPageData[];
  /**
   * The _id of a Folder which contains this JournalEntry
   */
  folder: string | null;
  /**
   * The numeric sort value which orders this JournalEntry relative to its siblings
   */
  sort?: number;
  /**
   * An object which configures ownership of this JournalEntry
   */
  ownership?: object;
  /**
   * An object of optional key/value flags
   */
  flags: object;
  /**
   * An object of creation and access information
   */
  _stats: DocumentStats;
};
export type JournalEntryPageImageData = {
  /**
   * A caption for the image.
   */
  caption?: string;
};
export type JournalEntryPageTextData = {
  /**
   * The content of the JournalEntryPage in a format appropriate for its type.
   */
  content?: string;
  /**
   * The original markdown source, if applicable.
   */
  markdown?: string;
  /**
   * The format of the page's content, in CONST.JOURNAL_ENTRY_PAGE_FORMATS.
   */
  format: number;
};
export type JournalEntryPageVideoData = {
  /**
   * Automatically loop the video?
   */
  loop?: boolean;
  /**
   * Should the video play automatically?
   */
  autoplay?: boolean;
  /**
   * The volume level of any audio that the video file contains.
   */
  volume?: number;
  /**
   * The starting point of the video, in seconds.
   */
  timestamp?: number;
  /**
   * The width of the video, otherwise it will fill the available container width.
   */
  width?: number;
  /**
   * The height of the video, otherwise it will use the aspect ratio of the source
   *             video, or 16:9 if that aspect ratio is not available.
   */
  height?: number;
};
export type JournalEntryPageTitleData = {
  /**
   * Whether to render the page's title in the overall journal view.
   */
  show: boolean;
  /**
   * The heading level to render this page's title at in the overall journal view.
   */
  level: number;
};
export type JournalEntryPageData = {
  /**
   * The _id which uniquely identifies this JournalEntryPage embedded document.
   */
  _id: string;
  /**
   * The text name of this page.
   */
  name: string;
  /**
   * The type of this page.
   */
  type: string;
  /**
   * Data that control's the display of this page's title.
   */
  title: JournalEntryPageTitleData;
  /**
   * Data particular to image journal entry pages.
   */
  image: JournalEntryPageImageData;
  /**
   * Data particular to text journal entry pages.
   */
  text: JournalEntryPageTextData;
  /**
   * Data particular to video journal entry pages.
   */
  video: JournalEntryPageVideoData;
  /**
   * The URI of the image or other external media to be used for this page.
   */
  src?: string;
  /**
   * System-specific data.
   */
  system: object;
  /**
   * The numeric sort value which orders this page relative to its siblings.
   */
  sort: number;
  /**
   * An object which configures the ownership of this page.
   */
  ownership?: object;
  /**
   * An object of optional key/value flags
   */
  flags: object;
  /**
   * An object of creation and access information
   */
  _stats: DocumentStats;
};
export type MacroData = {
  /**
   * The _id which uniquely identifies this Macro document
   */
  _id: string;
  /**
   * The name of this Macro
   */
  name: string;
  /**
   * A Macro subtype from CONST.MACRO_TYPES
   */
  type: string;
  /**
   * The _id of a User document which created this Macro *
   */
  author: string;
  /**
   * An image file path which provides the thumbnail artwork for this Macro
   */
  img?: string;
  /**
   * The scope of this Macro application from CONST.MACRO_SCOPES
   */
  scope?: string;
  /**
   * The string content of the macro command
   */
  command: string;
  /**
   * The _id of a Folder which contains this Macro
   */
  folder: string | null;
  /**
   * The numeric sort value which orders this Macro relative to its siblings
   */
  sort?: number;
  /**
   * An object which configures ownership of this Macro
   */
  ownership?: object;
  /**
   * An object of optional key/value flags
   */
  flags: object;
  /**
   * An object of creation and access information
   */
  _stats: DocumentStats;
};
export type MeasuredTemplateData = {
  /**
   * The _id which uniquely identifies this BaseMeasuredTemplate embedded document
   */
  _id: string;
  /**
   * The _id of the user who created this measured template
   */
  user: string;
  /**
   * The value in CONST.MEASURED_TEMPLATE_TYPES which defines the geometry type of this template
   */
  t?: string;
  /**
   * The x-coordinate position of the origin of the template effect
   */
  x?: number;
  /**
   * The y-coordinate position of the origin of the template effect
   */
  y?: number;
  /**
   * The distance of the template effect
   */
  distance?: number;
  /**
   * The angle of rotation for the measured template
   */
  direction?: number;
  /**
   * The angle of effect of the measured template, applies to cone types
   */
  angle?: number;
  /**
   * The width of the measured template, applies to ray types
   */
  width?: number;
  /**
   * 000000] A color string used to tint the border of the template shape
   */
  borderColor?: string;
  /**
   * A color string used to tint the fill of the template shape
   */
  fillColor?: string;
  /**
   * A repeatable tiling texture used to add a texture fill to the template shape
   */
  texture?: string;
  /**
   * Is the template currently hidden?
   */
  hidden?: boolean;
  /**
   * An object of optional key/value flags
   */
  flags: object;
};
export type NoteData = {
  /**
   * The _id which uniquely identifies this BaseNote embedded document
   */
  _id: string;
  /**
   * The _id of a JournalEntry document which this Note represents
   */
  entryId?: string | null;
  /**
   * The _id of a specific JournalEntryPage document which this Note represents
   */
  pageId?: string | null;
  /**
   * The x-coordinate position of the center of the note icon
   */
  x?: number;
  /**
   * The y-coordinate position of the center of the note icon
   */
  y?: number;
  /**
   * An image icon used to represent this note
   */
  texture?: TextureData;
  /**
   * The pixel size of the map note icon
   */
  iconSize?: number;
  /**
   * Optional text which overrides the title of the linked Journal Entry
   */
  text?: string;
  /**
   * The font family used to display the text label on this note, defaults to
   *         CONFIG.defaultFontFamily
   */
  fontFamily?: string;
  /**
   * The font size used to display the text label on this note
   */
  fontSize?: number;
  /**
   * A value in CONST.TEXT_ANCHOR_POINTS which defines where the text label anchors
   *       to the note icon.
   */
  textAnchor?: number;
  /**
   * The string that defines the color with which the note text is rendered
   */
  textColor?: string;
  /**
   * Whether this map pin is globally visible or requires LoS to see.
   */
  global?: boolean;
  /**
   * An object of optional key/value flags
   */
  flags: object;
};
export type PlaylistData = {
  /**
   * The _id which uniquely identifies this Playlist document
   */
  _id: string;
  /**
   * The name of this playlist
   */
  name: string;
  /**
   * The description of this playlist
   */
  description: string;
  /**
   * A Collection of PlaylistSounds embedded documents which belong to this playlist
   */
  sounds: Collection<BasePlaylistSound>;
  /**
   * The playback mode for sounds in this playlist
   */
  mode?: number;
  /**
   * A channel in CONST.AUDIO_CHANNELS where all sounds in this playlist are played
   */
  channel: string;
  /**
   * Is this playlist currently playing?
   */
  playing?: boolean;
  /**
   * A duration in milliseconds to fade volume transition
   */
  fade?: number;
  /**
   * The _id of a Folder which contains this playlist
   */
  folder: string | null;
  /**
   * The sorting mode used for this playlist.
   */
  sorting: string;
  /**
   * The numeric sort value which orders this playlist relative to its siblings
   */
  sort?: number;
  /**
   * A seed used for playlist randomization to guarantee that all clients generate the same random order.
   */
  seed?: number;
  /**
   * An object which configures ownership of this Playlist
   */
  ownership?: object;
  /**
   * An object of optional key/value flags
   */
  flags: object;
  /**
   * An object of creation and access information
   */
  _stats: DocumentStats;
};
export type PlaylistSoundData = {
  /**
   * The _id which uniquely identifies this PlaylistSound document
   */
  _id: string;
  /**
   * The name of this sound
   */
  name: string;
  /**
   * The description of this sound
   */
  description: string;
  /**
   * The audio file path that is played by this sound
   */
  path: string;
  /**
   * A channel in CONST.AUDIO_CHANNELS where this sound is played
   */
  channel: string;
  /**
   * Is this sound currently playing?
   */
  playing?: boolean;
  /**
   * The time in seconds at which playback was paused
   */
  pausedTime?: number;
  /**
   * Does this sound loop?
   */
  repeat?: boolean;
  /**
   * The audio volume of the sound, from 0 to 1
   */
  volume?: number;
  /**
   * A duration in milliseconds to fade volume transition
   */
  fade?: number;
  /**
   * The sort order of the PlaylistSound relative to others in the same collection
   */
  sort?: number;
  /**
   * An object of optional key/value flags
   */
  flags: object;
};
export type RollTableData = {
  /**
   * The _id which uniquely identifies this RollTable document
   */
  _id: string;
  /**
   * The name of this RollTable
   */
  name: string;
  /**
   * An image file path which provides the thumbnail artwork for this RollTable
   */
  img?: string;
  /**
   * The HTML text description for this RollTable document
   */
  description?: string;
  /**
   * A Collection of TableResult embedded documents which belong to this RollTable
   */
  results?: Collection<BaseTableResult>;
  /**
   * The Roll formula which determines the results chosen from the table
   */
  formula: string;
  /**
   * Are results from this table drawn with replacement?
   */
  replacement?: boolean;
  /**
   * Is the Roll result used to draw from this RollTable displayed in chat?
   */
  displayRoll?: boolean;
  /**
   * The _id of a Folder which contains this RollTable
   */
  folder: string | null;
  /**
   * The numeric sort value which orders this RollTable relative to its siblings
   */
  sort?: number;
  /**
   * An object which configures ownership of this RollTable
   */
  ownership?: object;
  /**
   * An object of optional key/value flags
   */
  flags: object;
  /**
   * An object of creation and access information
   */
  _stats: DocumentStats;
};
export type SceneData = {
  /**
   * The _id which uniquely identifies this Scene document
   */
  _id: string;
  /**
   * The name of this scene
   */
  name: string;
  /**
   * Is this scene currently active? Only one scene may be active at a given time
   */
  active?: boolean;
  /**
   * Is this scene displayed in the top navigation bar?
   */
  navigation?: boolean;
  /**
   * The sorting order of this Scene in the navigation bar relative to siblings
   */
  navOrder?: number;
  /**
   * A string which overrides Scene name for display in the navigation bar
   */
  navName?: string;
  /**
   * An image or video file that provides the background texture for the scene.
   */
  background?: TextureData | null;
  /**
   * An image or video file path providing foreground media for the scene
   */
  foreground?: string | null;
  /**
   * The elevation of the foreground image
   */
  foregroundElevation?: number;
  /**
   * A thumbnail image which depicts the scene at lower resolution
   */
  thumb?: string | null;
  /**
   * The width of the scene canvas, normally the width of the background media
   */
  width?: number;
  /**
   * The height of the scene canvas, normally the height of the background media
   */
  height?: number;
  /**
   * The proportion of canvas padding applied around the outside of the scene
   *       dimensions to provide additional buffer space
   */
  padding?: number;
  /**
   * The initial view coordinates for the scene
   */
  initial?: {
    x: number;
    y: number;
    scale: number;
  } | null;
  /**
   * 999999] The color of the canvas displayed behind the scene background
   */
  backgroundColor?: string | null;
  /**
   * Grid configuration for the scene
   */
  grid?: GridData;
  /**
   * Do Tokens require vision in order to see the Scene environment?
   */
  tokenVision?: boolean;
  /**
   * The ambient darkness level in this Scene, where 0 represents midday
   *         (maximum illumination) and 1 represents midnight (maximum darkness)
   */
  darkness?: number;
  /**
   * Should fog exploration progress be tracked for this Scene?
   */
  fogExploration?: boolean;
  /**
   * The timestamp at which fog of war was last reset for this Scene.
   */
  fogReset?: number;
  /**
   * A special overlay image or video texture which is used for fog of war
   */
  fogOverlay?: string | null;
  /**
   * A color tint applied to explored regions of fog of war
   */
  fogExploredColor?: string | null;
  /**
   * A color tint applied to unexplored regions of fog of war
   */
  fogUnexploredColor?: string | null;
  /**
   * The environment data applied to the Scene.
   */
  environment?: any;
  /**
   * If cycling is activated for the Scene, between base and darkness environment data.
   */
  cycle?: boolean;
  /**
   * The base ambience values pertaining to the Scene.
   */
  base?: any;
  /**
   * A collection of embedded Drawing objects.
   */
  drawings?: Collection<BaseDrawing>;
  /**
   * A collection of embedded Tile objects.
   */
  tiles?: Collection<BaseTile>;
  /**
   * A collection of embedded Token objects.
   */
  tokens?: Collection<BaseToken>;
  /**
   * A collection of embedded AmbientLight objects.
   */
  lights?: Collection<BaseAmbientLight>;
  /**
   * A collection of embedded Note objects.
   */
  notes?: Collection<BaseNote>;
  /**
   * A collection of embedded AmbientSound objects.
   */
  sounds?: Collection<BaseAmbientSound>;
  /**
   * A collection of embedded MeasuredTemplate objects.
   */
  templates?: Collection<BaseMeasuredTemplate>;
  /**
   * A collection of embedded Wall objects
   */
  walls?: Collection<BaseWall>;
  /**
   * A linked Playlist document which should begin automatically playing when this
   *     Scene becomes active.
   */
  playlist?: BasePlaylist;
  /**
   * A linked PlaylistSound document from the selected playlist that will
   *   begin automatically playing when this Scene becomes active
   */
  playlistSound?: BasePlaylistSound;
  /**
   * A JournalEntry document which provides narrative details about this Scene
   */
  journal?: JournalEntry;
  /**
   * A named weather effect which should be rendered in this Scene.
   */
  weather?: string;
  /**
   * The _id of a Folder which contains this Actor
   */
  folder: string | null;
  /**
   * The numeric sort value which orders this Actor relative to its siblings
   */
  sort?: number;
  /**
   * An object which configures ownership of this Scene
   */
  ownership?: object;
  /**
   * An object of optional key/value flags
   */
  flags: object;
  /**
   * An object of creation and access information
   */
  _stats: DocumentStats;
};
export type GridData = {
  /**
   * The type of grid, a number from CONST.GRID_TYPES.
   */
  type?: number;
  /**
   * The grid size which represents the width (or height) of a single grid space.
   */
  size?: number;
  /**
   * 000000]     A string representing the color used to render the grid lines.
   */
  color?: string;
  /**
   * A number between 0 and 1 for the opacity of the grid lines.
   */
  alpha?: number;
  /**
   * The number of distance units which are represented by a single grid space.
   */
  distance?: number;
  /**
   * A label for the units of measure which are used for grid distance.
   */
  units?: string;
};
export type EnvironmentData = EnvironmentData;
export type _GlobalLightData = {
  /**
   * Is the global light enabled?
   */
  enabled?: number;
  /**
   * Is the global light in bright mode?
   */
  bright?: boolean;
};
export type GlobalLightData = Pick<LightData, "alpha" | "color" | "coloration" | "contrast" | "luminosity" | "saturation" | "shadows" | "darkness"> & _GlobalLightData;
export type SceneEnvironmentData = SceneEnvironmentData;
export type RegionData = {
  /**
   * The Region _id which uniquely identifies it within its parent Scene
   */
  _id: string;
  /**
   * The name used to describe the Region
   */
  name: string;
  /**
   * The color used to highlight the Region
   */
  color?: string;
  /**
   * The shapes that make up the Region
   */
  shapes?: data.BaseShapeData[];
  /**
   * A collection of embedded RegionBehavior objects
   */
  behaviors?: Collection<BaseRegionBehavior>;
  /**
   * An object of optional key/value flags
   */
  flags: object;
};
export type RegionBehaviorData = {
  /**
   * The _id which uniquely identifies this RegionBehavior document
   */
  _id: string;
  /**
   * The name used to describe the RegionBehavior
   */
  name?: string;
  /**
   * An RegionBehavior subtype which configures the system data model applied
   */
  type: string;
  /**
   * The system data object which is defined by the system template.json model
   */
  system?: object;
  /**
   * Is the RegionBehavior currently disabled?
   */
  disabled?: boolean;
  /**
   * An object of optional key/value flags
   */
  flags: object;
  /**
   * An object of creation and access information
   */
  _stats: DocumentStats;
};
export type SettingData = {
  /**
   * The _id which uniquely identifies this Setting document
   */
  _id: string;
  /**
   * The setting key, a composite of {scope}.{name}
   */
  key: string;
  /**
   * The setting value, which is serialized to JSON
   */
  value: any;
  /**
   * An object of creation and access information
   */
  _stats: DocumentStats;
};
export type TableResultData = {
  /**
   * The _id which uniquely identifies this TableResult embedded document
   */
  _id: string;
  /**
   * A result subtype from CONST.TABLE_RESULT_TYPES
   */
  type?: string;
  /**
   * The text which describes the table result
   */
  text?: string;
  /**
   * An image file url that represents the table result
   */
  img?: string;
  /**
   * A named collection from which this result is drawn
   */
  documentCollection?: string;
  /**
   * The _id of a Document within the collection this result references
   */
  documentId?: string;
  /**
   * The probabilistic weight of this result relative to other results
   */
  weight?: number;
  /**
   * A length 2 array of ascending integers which defines the range of dice roll
   *            totals which produce this drawn result
   */
  range?: number[];
  /**
   * Has this result already been drawn (without replacement)
   */
  drawn?: boolean;
  /**
   * An object of optional key/value flags
   */
  flags: object;
};
export type TileOcclusionData = {
  /**
   * The occlusion mode from CONST.TILE_OCCLUSION_MODES
   */
  mode: number;
  /**
   * The occlusion alpha between 0 and 1
   */
  alpha: number;
  /**
   * An optional radius of occlusion used for RADIAL mode
   */
  radius?: number;
};
export type TileVideoData = {
  /**
   * Automatically loop the video?
   */
  loop: boolean;
  /**
   * Should the video play automatically?
   */
  autoplay: boolean;
  /**
   * The volume level of any audio that the video file contains
   */
  volume: number;
};
export type TileData = {
  /**
   * The _id which uniquely identifies this Tile embedded document
   */
  _id: string;
  /**
   * An image or video texture which this tile displays.
   */
  texture?: TextureData;
  /**
   * The pixel width of the tile
   */
  width?: number;
  /**
   * The pixel height of the tile
   */
  height?: number;
  /**
   * The x-coordinate position of the top-left corner of the tile
   */
  x?: number;
  /**
   * The y-coordinate position of the top-left corner of the tile
   */
  y?: number;
  /**
   * The elevation of the tile
   */
  elevation?: number;
  /**
   * The z-index ordering of this tile relative to its siblings
   */
  sort?: number;
  /**
   * The angle of rotation for the tile between 0 and 360
   */
  rotation?: number;
  /**
   * The tile opacity
   */
  alpha?: number;
  /**
   * Is the tile currently hidden?
   */
  hidden?: boolean;
  /**
   * Is the tile currently locked?
   */
  locked?: boolean;
  /**
   * The tile's occlusion settings
   */
  occlusion?: TileOcclusionData;
  /**
   * The tile's video settings
   */
  video?: TileVideoData;
  /**
   * An object of optional key/value flags
   */
  flags: object;
};
export type TokenData = {
  /**
   * The Token _id which uniquely identifies it within its parent Scene
   */
  _id: string;
  /**
   * The name used to describe the Token
   */
  name: string;
  /**
   * The display mode of the Token nameplate, from CONST.TOKEN_DISPLAY_MODES
   */
  displayName?: number;
  /**
   * The _id of an Actor document which this Token represents
   */
  actorId: string | null;
  /**
   * Does this Token uniquely represent a singular Actor, or is it one of many?
   */
  actorLink?: boolean;
  /**
   * The ActorDelta embedded document which stores the differences between this
   *      token and the base actor it represents.
   */
  delta?: BaseActorDelta;
  /**
   * The token's texture on the canvas.
   */
  texture: TextureData;
  /**
   * The width of the Token in grid units
   */
  width?: number;
  /**
   * The height of the Token in grid units
   */
  height?: number;
  /**
   * The x-coordinate of the top-left corner of the Token
   */
  x?: number;
  /**
   * The y-coordinate of the top-left corner of the Token
   */
  y?: number;
  /**
   * The vertical elevation of the Token, in distance units
   */
  elevation?: number;
  /**
   * Is the Token currently locked? A locked token cannot be moved or rotated via
   *      standard keyboard or mouse interaction.
   */
  locked?: boolean;
  /**
   * Prevent the Token image from visually rotating?
   */
  lockRotation?: boolean;
  /**
   * The rotation of the Token in degrees, from 0 to 360. A value of 0 represents a southward-facing Token.
   */
  rotation?: number;
  /**
   * The opacity of the token image
   */
  alpha?: number;
  /**
   * Is the Token currently hidden from player view?
   */
  hidden?: boolean;
  /**
   * A displayed Token disposition from CONST.TOKEN_DISPOSITIONS
   */
  disposition?: number;
  /**
   * The display mode of Token resource bars, from CONST.TOKEN_DISPLAY_MODES
   */
  displayBars?: number;
  /**
   * The configuration of the Token's primary resource bar
   */
  bar1?: TokenBarData;
  /**
   * The configuration of the Token's secondary resource bar
   */
  bar2?: TokenBarData;
  /**
   * Configuration of the light source that this Token emits
   */
  light?: data.LightData;
  /**
   * Configuration of sight and vision properties for the Token
   */
  sight: TokenSightData;
  /**
   * An array of detection modes which are available to this Token
   */
  detectionModes: TokenDetectionMode[];
  /**
   * An object of optional key/value flags
   */
  flags: object;
};
export type TokenSightData = {
  /**
   * Should vision computation and rendering be active for this Token?
   */
  enabled: boolean;
  /**
   * How far in distance units the Token can see without the aid of a light source.
   * If null, the sight range is unlimited.
   */
  range: number | null;
  /**
   * An angle at which the Token can see relative to their direction of facing
   */
  angle?: number;
  /**
   * The vision mode which is used to render the appearance of the visible area
   */
  visionMode?: string;
  /**
   * A special color which applies a hue to the visible area
   */
  color?: string;
  /**
   * A degree of attenuation which gradually fades the edges of the visible area
   */
  attenuation?: number;
  /**
   * An advanced customization for the perceived brightness of the visible area
   */
  brightness?: number;
  /**
   * An advanced customization of color saturation within the visible area
   */
  saturation?: number;
  /**
   * An advanced customization for contrast within the visible area
   */
  contrast?: number;
};
export type TokenDetectionMode = {
  /**
   * The id of the detection mode, a key from CONFIG.Canvas.detectionModes
   */
  id: string;
  /**
   * Whether or not this detection mode is presently enabled
   */
  enabled: boolean;
  /**
   * The maximum range in distance units at which this mode can detect targets.
   * If null, the detection range is unlimited.
   */
  range: number | null;
};
export type TokenBarData = {
  /**
   * The attribute path within the Token's Actor data which should be displayed
   */
  attribute?: string;
};
export type UserData = {
  /**
   * The _id which uniquely identifies this User document.
   */
  _id: string;
  /**
   * The user's name.
   */
  name: string;
  /**
   * The user's password. Available only on the Server side for security.
   */
  password?: string;
  /**
   * The user's password salt. Available only on the Server side for security.
   */
  passwordSalt?: string;
  /**
   * The user's avatar image.
   */
  avatar?: string | null;
  /**
   * A linked Actor document that is this user's impersonated character.
   */
  character?: BaseActor;
  /**
   * A color to represent this user.
   */
  color: string;
  /**
   * A mapping of hotbar slot number to Macro id for the user.
   */
  hotbar: object;
  /**
   * The user's individual permission configuration, see CONST.USER_PERMISSIONS.
   */
  permissions: object;
  /**
   * The user's role, see CONST.USER_ROLES.
   */
  role: number;
  /**
   * An object of optional key/value flags
   */
  flags: object;
  /**
   * An object of creation and access information
   */
  _stats: DocumentStats;
};
export type WallData = {
  /**
   * The _id which uniquely identifies the embedded Wall document
   */
  _id: string;
  /**
   * The wall coordinates, a length-4 array of finite numbers [x0,y0,x1,y1]
   */
  c: number[];
  /**
   * The illumination restriction type of this wall
   */
  light?: number;
  /**
   * The movement restriction type of this wall
   */
  move?: number;
  /**
   * The visual restriction type of this wall
   */
  sight?: number;
  /**
   * The auditory restriction type of this wall
   */
  sound?: number;
  /**
   * The direction of effect imposed by this wall
   */
  dir?: number;
  /**
   * The type of door which this wall contains, if any
   */
  door?: number;
  /**
   * The state of the door this wall contains, if any
   */
  ds?: number;
  /**
   * Configuration of threshold data for this wall
   */
  threshold: WallThresholdData;
  /**
   * An object of optional key/value flags
   */
  flags: object;
};
export type WallThresholdData = {
  /**
   * Minimum distance from a light source for which this wall blocks light
   */
  light?: number;
  /**
   * Minimum distance from a vision source for which this wall blocks vision
   */
  sight?: number;
  /**
   * Minimum distance from a sound source for which this wall blocks sound
   */
  sound?: number;
  /**
   * Whether to attenuate the source radius when passing through the wall
   */
  attenuation?: boolean;
};
