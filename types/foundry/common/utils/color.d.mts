/**
 * @typedef {import("../types.d.mts").ColorSource} ColorSource
 */
/**
 * A representation of a color in hexadecimal format.
 * This class provides methods for transformations and manipulations of colors.
 */
export default class Color extends Number {
  /**
   * Apply a linear interpolation between two colors, according to the weight.
   * @param {number}        color1       The first color to mix.
   * @param {number}        color2       The second color to mix.
   * @param {number}        weight       Weight of the linear interpolation.
   * @returns {number}                   The resulting mixed color
   */
  static mix(color1: number, color2: number, weight: number): number;
  /**
   * Multiply two colors.
   * @param {number}        color1       The first color to multiply.
   * @param {number}        color2       The second color to multiply.
   * @returns {number}                   The result.
   */
  static multiply(color1: number, color2: number): number;
  /**
   * Multiply a color by a scalar
   * @param {number} color        The color to multiply.
   * @param {number} scalar       A static scalar to multiply with.
   * @returns {number}            The resulting color as a number.
   */
  static multiplyScalar(color: number, scalar: number): number;
  /**
   * Maximize two colors.
   * @param {number}        color1       The first color.
   * @param {number}        color2       The second color.
   * @returns {number}                   The result.
   */
  static maximize(color1: number, color2: number): number;
  /**
   * Maximize a color by a static scalar.
   * @param {number} color         The color to maximize.
   * @param {number} scalar        Scalar to maximize with (normalized).
   * @returns {number}             The resulting color as a number.
   */
  static maximizeScalar(color: number, scalar: number): number;
  /**
   * Add two colors.
   * @param {number}        color1       The first color.
   * @param {number}        color2       The second color.
   * @returns {number}                   The resulting color as a number.
   */
  static add(color1: number, color2: number): number;
  /**
   * Add a static scalar to a color.
   * @param {number} color         The color.
   * @param {number} scalar        Scalar to add with (normalized).
   * @returns {number}             The resulting color as a number.
   */
  static addScalar(color: number, scalar: number): number;
  /**
   * Subtract two colors.
   * @param {number}        color1       The first color.
   * @param {number}        color2       The second color.
   */
  static subtract(color1: number, color2: number): number;
  /**
   * Subtract a color by a static scalar.
   * @param {number} color         The color.
   * @param {number} scalar        Scalar to subtract with (normalized).
   * @returns {number}             The resulting color as a number.
   */
  static subtractScalar(color: number, scalar: number): number;
  /**
   * Minimize two colors.
   * @param {number}        color1       The first color.
   * @param {number}        color2       The second color.
   */
  static minimize(color1: number, color2: number): number;
  /**
   * Minimize a color by a static scalar.
   * @param {number} color         The color.
   * @param {number} scalar        Scalar to minimize with (normalized).
   */
  static minimizeScalar(color: number, scalar: number): number;
  /**
   * Convert a color to RGB and assign values to a passed array.
   * @param {number} color   The color to convert to RGB values.
   * @param {number[]} vec3  Receive the result. Must be an array with at least a length of 3.
   */
  static applyRGB(color: number, vec3: number[]): void;
  /**
   * Create a Color instance from an RGB array.
   * @param {ColorSource} color     A color input
   * @returns {Color}               The hex color instance or NaN
   */
  static from(color: ColorSource): Color;
  /**
   * Create a Color instance from a color string which either includes or does not include a leading #.
   * @param {string} color                      A color string
   * @returns {Color}                           The hex color instance
   */
  static fromString(color: string): Color;
  /**
   * Create a Color instance from an RGB array.
   * @param {[number, number, number]} rgb      An RGB tuple
   * @returns {Color}                           The hex color instance
   */
  static fromRGB(rgb: [number, number, number]): Color;
  /**
   * Create a Color instance from an RGB normalized values.
   * @param {number} r                          The red value
   * @param {number} g                          The green value
   * @param {number} b                          The blue value
   * @returns {Color}                           The hex color instance
   */
  static fromRGBvalues(r: number, g: number, b: number): Color;
  /**
   * Create a Color instance from an HSV array.
   * Conversion formula adapted from http://en.wikipedia.org/wiki/HSV_color_space.
   * Assumes h, s, and v are contained in the set [0, 1].
   * @param {[number, number, number]} hsv      An HSV tuple
   * @returns {Color}                           The hex color instance
   */
  static fromHSV(hsv: [number, number, number]): Color;
  /**
   * Create a Color instance from an HSL array.
   * Assumes h, s, and l are contained in the set [0, 1].
   * @param {[number, number, number]} hsl      An HSL tuple
   * @returns {Color}                           The hex color instance
   */
  static fromHSL(hsl: [number, number, number]): Color;
  /**
   * Create a Color instance (sRGB) from a linear rgb array.
   * Assumes r, g, and b are contained in the set [0, 1].
   * @link https://en.wikipedia.org/wiki/SRGB#Transformation
   * @param {[number, number, number]} linear   The linear rgb array
   * @returns {Color}                           The hex color instance
   */
  static fromLinearRGB(linear: [number, number, number]): Color;
  /**
   * Is this a valid color?
   * @type {boolean}
   */
  get valid(): boolean;
  /**
   * A CSS-compatible color string.
   * If this color is not valid, the empty string is returned.
   * An alias for Color#toString.
   * @type {string}
   */
  get css(): string;
  /**
   * The color represented as an RGB array.
   * @type {[number, number, number]}
   */
  get rgb(): [number, number, number];
  /**
   * The numeric value of the red channel between [0, 1].
   * @type {number}
   */
  get r(): number;
  /**
   * The numeric value of the green channel between [0, 1].
   * @type {number}
   */
  get g(): number;
  /**
   * The numeric value of the blue channel between [0, 1].
   * @type {number}
   */
  get b(): number;
  /**
   * The maximum value of all channels.
   * @type {number}
   */
  get maximum(): number;
  /**
   * The minimum value of all channels.
   * @type {number}
   */
  get minimum(): number;
  /**
   * Get the value of this color in little endian format.
   * @type {number}
   */
  get littleEndian(): number;
  /**
   * The color represented as an HSV array.
   * Conversion formula adapted from http://en.wikipedia.org/wiki/HSV_color_space.
   * Assumes r, g, and b are contained in the set [0, 1] and returns h, s, and v in the set [0, 1].
   * @type {[number, number, number]}
   */
  get hsv(): [number, number, number];
  /**
   * The color represented as an HSL array.
   * Assumes r, g, and b are contained in the set [0, 1] and returns h, s, and l in the set [0, 1].
   * @type {[number, number, number]}
   */
  get hsl(): [number, number, number];
  /**
   * The color represented as a linear RGB array.
   * Assumes r, g, and b are contained in the set [0, 1] and returns linear r, g, and b in the set [0, 1].
   * @link https://en.wikipedia.org/wiki/SRGB#Transformation
   * @type {Color}
   */
  get linear(): Color;
  /** @override */
  override toString(radix: any): string;
  /**
   * Serialize the Color.
   * @returns {string}    The color as a CSS string
   */
  toJSON(): string;
  /**
   * Returns the color as a CSS string.
   * @returns {string}    The color as a CSS string
   */
  toHTML(): string;
  /**
   * Test whether this color equals some other color
   * @param {Color|number} other  Some other color or hex number
   * @returns {boolean}           Are the colors equal?
   */
  equals(other: Color | number): boolean;
  /**
   * Get a CSS-compatible RGBA color string.
   * @param {number} alpha      The desired alpha in the range [0, 1]
   * @returns {string}          A CSS-compatible RGBA string
   */
  toRGBA(alpha: number): string;
  /**
   * Mix this Color with some other Color using a provided interpolation weight.
   * @param {Color} other       Some other Color to mix with
   * @param {number} weight     The mixing weight placed on this color where weight is placed on the other color
   * @returns {Color}           The resulting mixed Color
   */
  mix(other: Color, weight: number): Color;
  /**
   * Multiply this Color by another Color or a static scalar.
   * @param {Color|number} other  Some other Color or a static scalar.
   * @returns {Color}             The resulting Color.
   */
  multiply(other: Color | number): Color;
  /**
   * Add this Color by another Color or a static scalar.
   * @param {Color|number} other  Some other Color or a static scalar.
   * @returns {Color}             The resulting Color.
   */
  add(other: Color | number): Color;
  /**
   * Subtract this Color by another Color or a static scalar.
   * @param {Color|number} other  Some other Color or a static scalar.
   * @returns {Color}             The resulting Color.
   */
  subtract(other: Color | number): Color;
  /**
   * Max this color by another Color or a static scalar.
   * @param {Color|number} other  Some other Color or a static scalar.
   * @returns {Color}             The resulting Color.
   */
  maximize(other: Color | number): Color;
  /**
   * Min this color by another Color or a static scalar.
   * @param {Color|number} other  Some other Color or a static scalar.
   * @returns {Color}             The resulting Color.
   */
  minimize(other: Color | number): Color;
  /**
   * Set an rgb array with the rgb values contained in this Color class.
   * @param {number[]} vec3  Receive the result. Must be an array with at least a length of 3.
   */
  applyRGB(vec3: number[]): void;
  /**
   * Iterating over a Color is equivalent to iterating over its [r,g,b] color channels.
   * @returns {Generator<number>}
   */
  [Symbol.iterator](): Generator<number>;
}
export type ColorSource = import('../types.d.mts').ColorSource;
