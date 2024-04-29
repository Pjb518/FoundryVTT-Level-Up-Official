import { DataModel } from '../abstract/module.d.mts';
import * as fields from './fields.d.mts';
import * as documents from '../documents/_module.d.mts';

export type DataFieldOptions = import('./fields.d.mts').DataFieldOptions;
export type FilePathFieldOptions = import('./fields.d.mts').FilePathFieldOptions;
export type LightAnimationData = {
  /**
   * The animation type which is applied
   */
  type: string;
  /**
   * The speed of the animation, a number between 0 and 10
   */
  speed: number;
  /**
   * The intensity of the animation, a number between 1 and 10
   */
  intensity: number;
  /**
   * Reverse the direction of animation.
   */
  reverse: boolean;
};
/**
 * @typedef {import("./fields.d.mts").DataFieldOptions} DataFieldOptions
 * @typedef {import("./fields.d.mts").FilePathFieldOptions} FilePathFieldOptions
 */
/**
 * @typedef {Object} LightAnimationData
 * @property {string} type          The animation type which is applied
 * @property {number} speed         The speed of the animation, a number between 0 and 10
 * @property {number} intensity     The intensity of the animation, a number between 1 and 10
 * @property {boolean} reverse      Reverse the direction of animation.
 */
/**
 * A reusable document structure for the internal data used to render the appearance of a light source.
 * This is re-used by both the AmbientLightData and TokenData classes.
 * @extends DataModel
 * @memberof data
 *
 * @property {boolean} negative           Is this light source a negative source? (i.e. darkness source)
 * @property {number} alpha               An opacity for the emitted light, if any
 * @property {number} angle               The angle of emission for this point source
 * @property {number} bright              The allowed radius of bright vision or illumination
 * @property {number} color               A tint color for the emitted light, if any
 * @property {number} coloration          The coloration technique applied in the shader
 * @property {number} contrast            The amount of contrast this light applies to the background texture
 * @property {number} dim                 The allowed radius of dim vision or illumination
 * @property {number} attenuation         Fade the difference between bright, dim, and dark gradually?
 * @property {number} luminosity          The luminosity applied in the shader
 * @property {number} saturation          The amount of color saturation this light applies to the background texture
 * @property {number} shadows             The depth of shadows this light applies to the background texture
 * @property {LightAnimationData} animation  An animation configuration for the source
 * @property {{min: number, max: number}} darkness  A darkness range (min and max) for which the source should be active
 */
export class LightData extends DataModel {
  static defineSchema(): {
    negative: fields.BooleanField;
    priority: fields.NumberField;
    alpha: fields.AlphaField;
    angle: fields.AngleField;
    bright: fields.NumberField;
    color: fields.ColorField;
    coloration: fields.NumberField;
    dim: fields.NumberField;
    attenuation: fields.AlphaField;
    luminosity: fields.NumberField;
    saturation: fields.NumberField;
    contrast: fields.NumberField;
    shadows: fields.NumberField;
    animation: fields.SchemaField;
    darkness: fields.SchemaField;
  };
  /** @inheritDoc */
  static migrateData(data: any): any;
}
/**
 * Extend the base TokenData to define a PrototypeToken which exists within a parent Actor.
 * @extends abstract.DataModel
 * @memberof data
 * @property {boolean} randomImg      Does the prototype token use a random wildcard image?
 */
export class PrototypeToken {
  static defineSchema(): {
    _id: fields.DocumentIdField;
    name: fields.StringField;
    displayName: fields.NumberField;
    actorId: fields.ForeignDocumentField;
    actorLink: fields.BooleanField;
    delta: import('../documents/token.d.mts').ActorDeltaField;
    appendNumber: fields.BooleanField;
    prependAdjective: fields.BooleanField;
    width: fields.NumberField;
    height: fields.NumberField;
    texture: TextureData;
    hexagonalShape: fields.NumberField;
    x: fields.NumberField;
    y: fields.NumberField;
    elevation: fields.NumberField;
    sort: fields.NumberField;
    locked: fields.BooleanField;
    lockRotation: fields.BooleanField;
    rotation: fields.AngleField;
    alpha: fields.AlphaField;
    hidden: fields.BooleanField;
    disposition: fields.NumberField;
    displayBars: fields.NumberField;
    bar1: fields.SchemaField;
    bar2: fields.SchemaField;
    light: fields.EmbeddedDataField;
    sight: fields.SchemaField;
    detectionModes: fields.ArrayField;
    occludable: fields.SchemaField;
    ring: fields.SchemaField;
    _regions: fields.ArrayField;
    flags: fields.ObjectField;
  };
  /**
   * @see ClientDocument.database
   * @ignore
   */
  static get database(): any;
  constructor(data?: {}, options?: {});
  /**
   * The Actor which owns this Prototype Token
   * @type {documents.BaseActor}
   */
  get actor(): documents.BaseActor;
  /** @inheritdoc */
  toObject(source?: boolean): any;
  /**
   * @see abstract.Document#update
   * @ignore
   */
  update(data: any, options: any): Promise<import('../abstract/document.d.mts').default>;
  /**
   * @see abstract.Document#getFlag
   * @ignore
   */
  getFlag(...args: any[]): any;
  /**
   * @see abstract.Document#getFlag
   * @ignore
   */
  setFlag(...args: any[]): any;
  /**
   * @see abstract.Document#unsetFlag
   * @ignore
   */
  unsetFlag(...args: any[]): Promise<any>;
  /**
   * @see abstract.Document#testUserPermission
   * @ignore
   */
  testUserPermission(user: any, permission: any, { exact }?: {
    exact?: boolean;
  }): boolean;
  /**
   * @see documents.BaseActor#isOwner
   * @ignore
   */
  get isOwner(): any;
}
/**
 * A data model intended to be used as an inner EmbeddedDataField which defines a geometric shape.
 * @extends DataModel
 * @memberof data
 *
 * @property {string} type                The type of shape, a value in ShapeData.TYPES.
 *                                        For rectangles, the x/y coordinates are the top-left corner.
 *                                        For circles, the x/y coordinates are the center of the circle.
 *                                        For polygons, the x/y coordinates are the first point of the polygon.
 * @property {number} [width]             For rectangles, the pixel width of the shape.
 * @property {number} [height]            For rectangles, the pixel width of the shape.
 * @property {number} [radius]            For circles, the pixel radius of the shape.
 * @property {number[]} [points]          For polygons, the array of polygon coordinates which comprise the shape.
 */
export class ShapeData extends DataModel {
  static defineSchema(): {
    type: fields.StringField;
    width: fields.NumberField;
    height: fields.NumberField;
    radius: fields.NumberField;
    points: fields.ArrayField;
  };
  /**
   * The primitive shape types which are supported
   * @enum {string}
   */
  static TYPES: {
    RECTANGLE: string;
    CIRCLE: string;
    ELLIPSE: string;
    POLYGON: string;
  };
}
/**
 * A data model intended to be used as an inner EmbeddedDataField which defines a geometric shape.
 * @extends DataModel
 * @memberof data
 * @abstract
 *
 * @property {string} type                                          The type of shape, a value in BaseShapeData.TYPES.
 * @property {{bottom: number|null, top: number|null}} [elevation]  The bottom and top elevation of the shape.
 *                                                                  A value of null means -/+Infinity.
 * @property {boolean} [hole=false]                                 Is this shape a hole?
 */
export class BaseShapeData extends DataModel {
  /**
   * The possible shape types.
   * @type {Readonly<{
   *   rectangle: RectangleShapeData,
   *   circle: CircleShapeData,
   *   ellipse: EllipseShapeData,
   *   polygon: PolygonShapeData
   * }>}
   */
  static get TYPES(): Readonly<{
    rectangle: RectangleShapeData;
    circle: CircleShapeData;
    ellipse: EllipseShapeData;
    polygon: PolygonShapeData;
  }>;
  static '__#27@#TYPES': any;

  /**
   * The type of this shape.
   * @type {string}
   */
  static TYPE: string;
  /** @override */
  static override defineSchema(): {
    type: fields.StringField;
    hole: fields.BooleanField;
  };
}
/**
 * The data model for a rectangular shape.
 * @extends DataModel
 * @memberof data
 *
 * @property {number} x               The top-left x-coordinate in pixels before rotation.
 * @property {number} y               The top-left y-coordinate in pixels before rotation.
 * @property {number} width           The width of the rectangle in pixels.
 * @property {number} height          The height of the rectangle in pixels.
 * @property {number} [rotation=0]    The rotation around the center of the rectangle in degrees.
 */
export class RectangleShapeData extends DataModel {
}
/**
 * The data model for a circle shape.
 * @extends DataModel
 * @memberof data
 *
 * @property {number} x         The x-coordinate of the center point in pixels.
 * @property {number} y         The y-coordinate of the center point in pixels.
 * @property {number} radius    The radius of the circle in pixels.
 */
export class CircleShapeData extends DataModel {
}
/**
 * The data model for an ellipse shape.
 * @extends DataModel
 * @memberof data
 *
 * @property {number} x               The x-coordinate of the center point in pixels.
 * @property {number} y               The y-coordinate of the center point in pixels.
 * @property {number} radiusX         The x-radius of the circle in pixels.
 * @property {number} radiusY         The y-radius of the circle in pixels.
 * @property {number} [rotation=0]    The rotation around the center of the rectangle in degrees.
 */
export class EllipseShapeData extends DataModel {
}
/**
 * The data model for a polygon shape.
 * @extends DataModel
 * @memberof data
 *
 * @property {number[]} points      The points of the polygon ([x0, y0, x1, y1, ...]).
 *                                  The polygon must not be self-intersecting.
 */
export class PolygonShapeData extends DataModel {
}
/**
 * A {@link fields.SchemaField} subclass used to represent texture data.
 * @property {string|null} src              The URL of the texture source.
 * @property {number} [anchorX=0]           The X coordinate of the texture anchor.
 * @property {number} [anchorY=0]           The Y coordinate of the texture anchor.
 * @property {number} [scaleX=1]            The scale of the texture in the X dimension.
 * @property {number} [scaleY=1]            The scale of the texture in the Y dimension.
 * @property {number} [offsetX=0]           The X offset of the texture with (0,0) in the top left.
 * @property {number} [offsetY=0]           The Y offset of the texture with (0,0) in the top left.
 * @property {number} [rotation=0]           An angle of rotation by which this texture is rotated around its center.
 * @property {string} [tint="#ffffff"]      The tint applied to the texture.
 * @property {number} [alphaThreshold=0]    Only pixels with an alpha value at or above this value are consider solid
 *                                          w.r.t. to occlusion testing and light/weather blocking.
 */
export class TextureData extends fields.SchemaField {
  /**
   * @param {DataFieldOptions} options        Options which are forwarded to the SchemaField constructor
   * @param {FilePathFieldOptions} srcOptions Additional options for the src field
   */
  constructor(options?: DataFieldOptions, {
    categories, initial, wildcard, label }
    ?: FilePathFieldOptions);
}
/**
 * A minimal data model used to represent a tombstone entry inside an EmbeddedCollectionDelta.
 * @see {EmbeddedCollectionDelta}
 * @extends DataModel
 * @memberof data
 *
 * @property {string} _id              The _id of the base Document that this tombstone represents.
 * @property {boolean} _tombstone      A property that identifies this entry as a tombstone.
 */
export class TombstoneData extends DataModel {
  /** @override */
  static override defineSchema(): {
    _id: fields.DocumentIdField;
    _tombstone: fields.BooleanField;
  };
}
