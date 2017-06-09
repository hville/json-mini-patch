/* hugov@runbox.com | https://github.com/hville/json-mini-patch.git | license:MIT */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * deep Equal check on JSON-like objects
 * @function
 * @param {!Object|!Array} obj - object to check
 * @param {!Object|!Array} ref - the reference
 * @return {boolean|void} truthy if equal
 */
function isEqual(obj, ref) {
	var cO = cType(obj),
			cR = cType(ref);
	if (cO !== cR) return
	switch (cO) {
		case Array:
			if (obj.length !== ref.length) return
			for (var i=0; i<obj.length; ++i) if (!isEqual(obj[i], ref[i])) return
			return true
		case Object:
			var ko = Object.keys(obj);
			if (ko.length !== Object.keys(ref).length) return
			for (i=0; i<ko.length; ++i) if (!isEqual(obj[ko[i]], ref[ko[i]])) return
			return true
		default:
			return obj === ref
	}
}

/**
 * @param {*} v - object to test
 * @return {Object|undefined} object Constructor type
 */
function cType(v) {
	return v === undefined ? undefined
		: v === null ? null
		: v.constructor || Object
}

/**
 * @function
 * @param	{Object} document - target JSON like object
 * @param	{Array} patch - JSON patch
 * @returns {Object} - result object
 */
function patch(document, actions) {
	var result = document;

	for (var i=0; i< actions.length; ++i) {
		var itm = actions[i],
				path = itm[1],
				op = ops[itm[0]];
		if (!path) throw Error(errorMsg('path', path))
		if (!op) throw Error(errorMsg('op', itm[0]))

		result = op(result, path, itm[2]);
		if (result === undefined) return document //test failed, patch canceled
	}
	return result
}

var ops = {
	t: function(res, keys, ref) {
		var val = get(res, keys);
		if (val === undefined) return
		if (isEqual(val, ref)) return res
	},
	d: del,
	a: add,
	r: rep,
	m: function(res, path, from) {
		var val = get(res, from);
		if (val === undefined) throw Error(errorMsg('from', from))
		return add(del(res, from), path, val)
	},
	c: function(res, path, from) {
		var val = get(res, from);
		if (val === undefined) throw Error(errorMsg('from', from))
		return add(res, path, val)
	}
};

/**
 * Climbs and clones through the path before making change
 * @param {Object} obj object to be cloned and changed
 * @param {Array} pth patch item array of keys path
 * @return {Object} modified result object
 */
function cloneLeaf(obj, pth) {
	var len = pth.length -1; // stop before the last key
	for (var i=0; i < len; ++i) {
		if (!obj[pth[i]]) throw Error(errorMsg('path', pth.toString()))
		obj = obj[pth[i]] = shallowClone(obj[pth[i]]);
	}
	return obj
}
/**
 * Format errors
 * @param {string} key patch item key when error triggered
 * @param {string} [val] patch item key value when error triggered
 * @return {string} error message
 */
function errorMsg(key, val) {
	return 'Patch item failed at ' + key + ':' + JSON.stringify(val)
}

// BASIC KEY OPERATIONS
function get(doc, pth) {
	for (var i=0, val = doc; i<pth.length; ++i) {
		if (!val) return
		val = val[pth[i]];
	}
	return val
}
function rep(doc, pth, val) {
	if (val === undefined) throw Error(errorMsg('value', val))
	if (!pth.length) return val

	var res = shallowClone(doc),
			tgt = cloneLeaf(res, pth),
			key = pth[pth.length-1];

	if (isEqual(tgt[key], val)) return doc //no change
	if (tgt[key] === undefined) throw Error(errorMsg('path key', key))
	tgt[key] = val;
	return res
}
function del(doc, pth) {
	if (!pth.length) return
	var res = shallowClone(doc),
			tgt = cloneLeaf(res, pth),
			key = pth[pth.length-1];

	if (tgt[key] === undefined) throw Error(errorMsg('path key', key))
	if (Array.isArray(tgt)) tgt.splice(key, 1);
	else delete tgt[key];
	return res
}
function add(doc, pth, val) {
	if (val === undefined) throw Error(errorMsg('value', val))
	if (!pth.length) return val
	var res = shallowClone(doc),
			tgt = cloneLeaf(res, pth),
			key = pth[pth.length-1];
	if (Array.isArray(tgt)) {
		// avoid comparison operators to prevent non digit number string conversions (eg "1e0")
		if (key === '-' || key === '' + tgt.length) tgt.push(val);
		else if (tgt[key] === undefined) throw Error(errorMsg('path key', key))
		else tgt.splice(key, 0, val);
		return res
	}
	if (isEqual(tgt[key], val)) return doc //no change
	tgt[key] = val;
	return res
}
/**
 * @param {Object|Array} obj - object or array to be cloned
 * @returns {Object|Array} clone
 */
function shallowClone(obj) {
	return Array.isArray(obj) ? obj.slice() : Object.assign({}, obj)
}

/**
 * convert JSON Pointer RFC 6901 to array of keys
 * @function
 * @param {string} ptr - JSON Pointer RFC 6901
 * @return {!Array} array of keys
 */
function getKeys(ptr) {
	var idx = -1,
			arr = [];
	for (var i=0; i<ptr.length; ++i) {
		if (ptr[i] === '/') arr[++idx] = '';
		else if (ptr[i] === '~') arr[idx] += ptr[++i] === '0' ? '~'
			: ptr[i] === '1' ? '/'
			: '';
		else arr[idx] += ptr[i];
	}
	return arr
}

/**
 * convert JSON Patch to a mini patch
 * @function
 * @param {Array<Object>} std standard compliant JSON patch
 * @return {Array<Array>|undefined} converted patch
 */
function compress(std) {
	for (var i=0, res=[]; i<std.length; ++i) {
		res[i] = stdToMinItem(std[i]);
		if (!res[i]) return
	}
	return res
}

/**
 * @param {Object} itm patch item to parse
 * @return {Array|undefined} parsed patch
 */
function stdToMinItem(itm) {
	var pth = getKeys(itm.path);
	if (itm.value && itm.from) return
	switch (itm.op) {
		case 'add': return ['a', pth, itm.value]
		case 'replace': return ['r', pth, itm.value]
		case 'remove': return ['d', pth]
		case 'test': return ['t', pth, itm.value]
		case 'move': return ['m', pth, getKeys(itm.from)]
		case 'copy': return ['c', pth, getKeys(itm.from)]
	}
}

/**
 * convert an array of keys path to a JSON pointer
 * @function
 * @param {Array} path - array of keys
 * @return {string} JSON pointer
 */
function getPointer(path) {
	for (var i=0, res=''; i<path.length; ++i) {
		res += '/' + escape(path[i]);
	}
	return res
}

/**
 * escape JSON Pointer reserve characters
 * @param {string} key - path key
 * @return {string} JSON pointer key
 */
function escape(key) {
	for (var i=0, res=''; i<key.length; ++i) {
		res += key[i] === '~' ? '~0'
		: key[i] === '/' ? '~1'
		: key[i];
	}
	return res
}

/**
 * convert a mini patch to the standard JSON patch
 * @function
 * @param {Array} min - mini patch item to be converted
 * @return {Array} - equivalent JSON Patch
 */
function restore(min) {
	return min.map(mini2patch)
}

/**
 * convert a mini patch item to standard JSON patch item
 * @param {Array} itm - mini patch item to be converted
 * @return {Object} - equivalent JSON Patch item
 */
function mini2patch(itm) {
	var ptr = getPointer(itm[1]);
	switch (itm[0]) {
		case ('a'): return {op:'add', path: ptr, value: itm[2]}
		case ('r'): return {op:'replace', path: ptr, value: itm[2]}
		case ('d'): return {op:'remove', path: ptr}
		case ('t'): return {op:'test', path: ptr, value: itm[2]}
		case ('m'): return {op:'move', path: ptr, from: getPointer(itm[2])}
		case ('c'): return {op:'copy', path: ptr, from: getPointer(itm[2])}
	}
}

function jsonpatch(doc, actions) {
	return patch(doc, compress(actions))
}

exports.jsonpatch = jsonpatch;
exports.patch = patch;
exports.compress = compress;
exports.restore = restore;
exports.getPointer = getPointer;
exports.getKeys = getKeys;
exports.isEqual = isEqual;
