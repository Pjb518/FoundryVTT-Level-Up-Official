/* eslint-disable no-param-reassign */
/**
   * A helper function which searches through an object to retrieve a value by a string key.
   * The method also supports arrays if the provided key is an integer index of the array.
   * The string key supports the notation a.b.c which would return object[a][b][c]
   * @param {object} object   The object to traverse
   * @param {string} key      An object property with notation a.b.c
   * @return {*}              The value of the found property
   */
export function getProperty(object, key) {
  if (!key || !object) return undefined;
  if (key in object) return object[key];
  let target = object;
  for (const p of key.split('.')) {
    if (!target || (typeof target !== 'object')) return undefined;
    if (p in target) target = target[p];
    else return undefined;
  }
  return target;
}

/* -------------------------------------------- */

/**
 * A helper function which searches through an object to assign a value using a string key
 * This string key supports the notation a.b.c which would target object[a][b][c]
 * @param {object} object   The object to update
 * @param {string} key      The string key
 * @param {*} value         The value to be assigned
 * @return {boolean}        Whether the value was changed from its previous value
 */
export function setProperty(object, key, value) {
  if (!key) return false;

  // Convert the key to an object reference if it contains dot notation
  let target = object;
  if (key.indexOf('.') !== -1) {
    const parts = key.split('.');
    key = parts.pop();
    target = parts.reduce((o, i) => {
      // eslint-disable-next-line no-prototype-builtins
      if (!o.hasOwnProperty(i)) o[i] = {};
      return o[i];
    }, object);
  }

  // Update the target
  if (!(key in target) || (target[key] !== value)) {
    target[key] = value;
    return true;
  }
  return false;
}

/**
   * Flatten a possibly multi-dimensional object to a one-dimensional one by converting all
   * nested keys to dot notation
   * @param {object} obj        The object to flatten
   * @param {number} [_d=0]     Track the recursion depth to prevent overflow
   * @return {object}           A flattened object
   */
export function flattenObject(obj, _d = 0) {
  const flat = {};
  if (_d > 100) {
    throw new Error('Maximum depth exceeded');
  }
  for (const [k, v] of Object.entries(obj)) {
    const t = getType(v);
    if (t === 'Object') {
      if (isEmpty$1(v)) flat[k] = v;
      const inner = flattenObject(v, _d + 1);
      for (const [ik, iv] of Object.entries(inner)) {
        flat[`${k}.${ik}`] = iv;
      }
    }
    else flat[k] = v;
  }
  return flat;
}

/**
 * Test whether a value is empty-like; either undefined or a content-less object.
 * @param {*} value       The value to test
 * @returns {boolean}     Is the value empty-like?
 */
export function isEmpty$1(value) {
  const t = getType(value);
  switch (t) {
    case 'undefined':
      return true;
    case 'null':
      return true;
    case 'Array':
      return !value.length;
    case 'Object':
      return !Object.keys(value).length;
    case 'Set':
    case 'Map':
      return !value.size;
    default:
      return false;
  }
}

/**
 * Learn the underlying data type of some variable. Supported identifiable types include:
 * undefined, null, number, string, boolean, function, Array, Set, Map, Promise, Error,
 * HTMLElement (client side only), Object (catchall for other object types)
 * @param {*} variable  A provided variable
 * @return {string}     The named type of the token
 */
export function getType(variable) {
  // Primitive types, handled with simple typeof check
  const typeOf = typeof variable;
  if (typeOf !== 'object') return typeOf;

  // Special cases of object
  if (variable === null) return 'null';
  if (!variable.constructor) return 'Object'; // Object with the null prototype.
  if (variable.constructor.name === 'Object') return 'Object'; // simple objects

  // Match prototype instances
  const prototypes = [
    [Array, 'Array'],
    [Set, 'Set'],
    [Map, 'Map'],
    [Promise, 'Promise'],
    [Error, 'Error']
    // [Color$1, 'number']
  ];
  if ('HTMLElement' in globalThis) prototypes.push([globalThis.HTMLElement, 'HTMLElement']);
  for (const [cls, type] of prototypes) {
    if (variable instanceof cls) return type;
  }

  // Unknown Object type
  return 'Object';
}
