/**
 * Quickly clone a simple piece of data, returning a copy which can be mutated safely.
 * This method DOES support recursive data structures containing inner objects or arrays.
 * This method DOES NOT support advanced object types like Set, Map, or other specialized classes.
 * @param {*} original                     Some sort of data
 * @param {object} [options]               Options to configure the behaviour of deepClone
 * @param {boolean} [options.strict=false]  Throw an Error if deepClone is unable to clone something instead of
 *                                          returning the original
 * @param {number} [options._d]             An internal depth tracker
 * @return {*}                             The clone of that data
 */
export function deepClone(original, { strict = false, _d = 0 } = {}) {
	if (_d > 100) {
		throw new Error(
			'Maximum depth exceeded. Be sure your object does not contain cyclical data structures.',
		);
	}
	_d++;

	// Simple types
	if (typeof original !== 'object' || original === null) return original;

	// Arrays
	if (Array.isArray(original)) return original.map((o) => deepClone(o, { strict, _d }));

	// Dates
	if (original instanceof Date) return new Date(original);

	// Unsupported advanced objects
	if (original.constructor && original.constructor !== Object) {
		if (strict) throw new Error('deepClone cannot clone advanced objects');
		return original;
	}

	// Other objects
	const clone = {};
	for (const k of Object.keys(original)) {
		clone[k] = deepClone(original[k], { strict, _d });
	}
	return clone;
}

/* -------------------------------------------- */

/**
 * A cheap data duplication trick which is relatively robust.
 * For a subset of cases the deepClone function will offer better performance.
 * @param {Object} original   Some sort of data
 */
export function duplicate(original) {
	return JSON.parse(JSON.stringify(original));
}

/* -------------------------------------------- */

/**
 * Expand a flattened object to be a standard nested Object by converting all dot-notation keys to inner objects.
 * Only simple objects will be expanded. Other Object types like class instances will be retained as-is.
 * @param {object} obj      The object to expand
 * @return {object}         An expanded object
 */
export function expandObject(obj) {
	function _expand(value, depth) {
		if (depth > 32) throw new Error('Maximum object expansion depth exceeded');
		if (!value) return value;
		if (Array.isArray(value)) return value.map((v) => _expand(v, depth + 1)); // Map arrays
		if (value.constructor?.name !== 'Object') return value; // Return advanced objects directly
		const expanded = {}; // Expand simple objects
		for (const [k, v] of Object.entries(value)) {
			setProperty(expanded, k, _expand(v, depth + 1));
		}
		return expanded;
	}
	return _expand(obj, 0);
}

/* -------------------------------------------- */

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
		if (!target || typeof target !== 'object') return undefined;
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
			// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
			if (!o.hasOwnProperty(i)) o[i] = {};
			return o[i];
		}, object);
	}

	// Update the target
	if (!(key in target) || target[key] !== value) {
		target[key] = value;
		return true;
	}
	return false;
}

/* -------------------------------------------- */

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
		} else flat[k] = v;
	}
	return flat;
}

/* -------------------------------------------- */

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

/* -------------------------------------------- */

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
		[Error, 'Error'],
		// [Color$1, 'number']
	];
	if ('HTMLElement' in globalThis) prototypes.push([globalThis.HTMLElement, 'HTMLElement']);
	for (const [cls, type] of prototypes) {
		if (variable instanceof cls) return type;
	}

	// Unknown Object type
	return 'Object';
}

/* -------------------------------------------- */

/**
 * Update a source object by replacing its keys and values with those from a target object.
 *
 * @param {object} original                           The initial object which should be updated with values from the
 *                                                    target
 * @param {object} [other={}]                         A new object whose values should replace those in the source
 * @param {object} [options={}]                       Additional options which configure the merge
 * @param {boolean} [options.insertKeys=true]         Control whether to insert new top-level objects into the resulting
 *                                                    structure which do not previously exist in the original object.
 * @param {boolean} [options.insertValues=true]       Control whether to insert new nested values into child objects in
 *                                                    the resulting structure which did not previously exist in the
 *                                                    original object.
 * @param {boolean} [options.overwrite=true]          Control whether to replace existing values in the source, or only
 *                                                    merge values which do not already exist in the original object.
 * @param {boolean} [options.recursive=true]          Control whether to merge inner-objects recursively (if true), or
 *                                                    whether to simply replace inner objects with a provided new value.
 * @param {boolean} [options.inplace=true]            Control whether to apply updates to the original object in-place
 *                                                    (if true), otherwise the original object is duplicated and the
 *                                                    copy is merged.
 * @param {boolean} [options.enforceTypes=false]      Control whether strict type checking requires that the value of a
 *                                                    key in the other object must match the data type in the original
 *                                                    data to be merged.
 * @param {boolean} [options.performDeletions=false]  Control whether to perform deletions on the original object if
 *                                                    deletion keys are present in the other object.
 * @param {number} [_d=0]                             A privately used parameter to track recursion depth.
 * @returns {object}                                  The original source object including updated, inserted, or
 *                                                    overwritten records.
 *
 * @example Control how new keys and values are added
 * ```js
 * mergeObject({k1: "v1"}, {k2: "v2"}, {insertKeys: false}); // {k1: "v1"}
 * mergeObject({k1: "v1"}, {k2: "v2"}, {insertKeys: true});  // {k1: "v1", k2: "v2"}
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {insertValues: false}); // {k1: {i1: "v1"}}
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {insertValues: true}); // {k1: {i1: "v1", i2: "v2"}}
 * ```
 *
 * @example Control how existing data is overwritten
 * ```js
 * mergeObject({k1: "v1"}, {k1: "v2"}, {overwrite: true}); // {k1: "v2"}
 * mergeObject({k1: "v1"}, {k1: "v2"}, {overwrite: false}); // {k1: "v1"}
 * ```
 *
 * @example Control whether merges are performed recursively
 * ```js
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {recursive: false}); // {k1: {i2: "v2"}}
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {recursive: true}); // {k1: {i1: "v1", i2: "v2"}}
 * ```
 *
 * @example Deleting an existing object key
 * ```js
 * mergeObject({k1: "v1", k2: "v2"}, {"-=k1": null}, {performDeletions: true});   // {k2: "v2"}
 * ```
 */
export function mergeObject(
	original,
	other = {},
	{
		insertKeys = true,
		insertValues = true,
		overwrite = true,
		recursive = true,
		inplace = true,
		enforceTypes = false,
		performDeletions = false,
	} = {},
	_d = 0,
) {
	other = other || {};
	if (!(original instanceof Object) || !(other instanceof Object)) {
		throw new Error('One of original or other are not Objects!');
	}
	const options = {
		insertKeys,
		insertValues,
		overwrite,
		recursive,
		inplace,
		enforceTypes,
		performDeletions,
	};

	// Special handling at depth 0
	if (_d === 0) {
		if (Object.keys(other).some((k) => /\./.test(k))) other = expandObject(other);
		if (Object.keys(original).some((k) => /\./.test(k))) {
			const expanded = expandObject(original);
			if (inplace) {
				Object.keys(original).forEach((k) => delete original[k]);
				Object.assign(original, expanded);
			} else original = expanded;
		} else if (!inplace) original = deepClone(original);
	}

	// Iterate over the other object
	for (const k of Object.keys(other)) {
		const v = other[k];
		// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
		if (original.hasOwnProperty(k)) _mergeUpdate(original, k, v, options, _d + 1);
		else _mergeInsert(original, k, v, options, _d + 1);
	}
	return original;
}
