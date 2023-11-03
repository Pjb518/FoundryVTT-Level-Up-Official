declare interface Utils {
  Collection: any,
  Color: any,
  HttpError: any,
  IterableWeakMap: any,
  IterableWeakSet: any,
  Semaphore: any,
  benchmark: any,
  closestPointToSegment: any,

  /** @deprecated */
  colorStringToHex: any,

  debounce<T>(callback: (...args: T) => any, delay: number): (...args: T) => void,

  deepClone<T>(original: T, options?: { strict: boolean } = { strict = false }): T,

  diffObject<T>(
    original: object,
    other: object,
    options?: { inner: boolean, deletionKeys: boolean } = { inner = false, deletionKeys = false }
  ): T,

  duplicate<T>(original: T): T,

  encodeURL: any,

  expandObject<T extends object>(obj: object): T,

  fetchJSONWithTimeout: any,

  filterObject(
    source: object,
    template: object,
    {
      deletionKeys: boolean,
      templateValues: boolean
    } = {
        deletionKeys = false,
        templateValues = false
      }
  ): object,

  flattenObject(obj: object, _d?: number = 0): any,

  formatFileSize: any,
  getDefiningClass: any,
  getParentClasses: any,

  getProperty(object: object, key: string): unknown,

  getRoute: any,

  getType(variable: any): string,

  hasProperty(object: object, key: string): boolean,

  /** @deprecated */
  hexToRGB: any,

  /** @deprecated */
  hexToRGBAString: any,

  /** @deprecated */
  hsvToRgb: any,

  invertObject: any,

  isEmpty(value: any): boolean,

  isNewerVersion(v1: number | string, v0: number | string): boolean,

  /** @deprecated */
  isObjectEmpty: any, // TODO:

  isSubclass(cls: any, parent: any): boolean,

  lineCircleIntersection: any,
  lineLineIntersection: any,
  lineSegmentsIntersection: any,

  logCompatibilityWarning(
    message: string,
    options?: {
      mode: number, since: number | string, until: number | string, details: string, stack: boolean
    } = { stack = false }
  ),

  mergeObject(
    original: object,
    other: object,
    options?: {
      insertKeys: boolean,
      insertValues: boolean,
      overwrite: boolean,
      recursive: boolean,
      inplace: boolean,
      enforceTypes: boolean
    } = {
        insertKeys = true,
        insertValues = true,
        overwrite = true,
        recursive = true,
        inplace = true,
        enforceTypes = false
      },
    _d?: number = 0
  ): object,

  objectEquals(a: object, b: object): boolean,

  orient2dFast: any,
  parseS3URL: any,

  parseUuid(uuid: string, options?: { relative: any } = {}): any,

  quadraticIntersection: any,

  randomID(length?: number = 16): string,

  /** @deprecated */
  rbgToHex: any,

  /** @deprecated */
  rgbToHsv: any,

  setProperty(object: object, key: string, value: unknown): boolean,

  threadLock: any,
  timeSince: any
}
