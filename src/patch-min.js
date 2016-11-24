var isEqual = require('./is-equal')
/**
 * @param	{Array} patch - JSON patch
 * @param	{Object} document - target JSON like object
 * @returns {Object} - result object
 */

module.exports = function (document, patch) {
	var result = document

	for (var i=0; i< patch.length; ++i) {
		var itm = patch[i],
				path = itm[1],
				op = ops[itm[0]]
		if (!path) throw Error(errorMsg('path', path))
		if (!op) throw Error(errorMsg('op', itm[0]))

		result = op(result, path, itm[2])
		if (result === undefined) return document //test failed, patch canceled
	}
	return result
}

var ops = {
	t: function(res, keys, ref) {
		var val = get(res, keys)
		if (val === undefined) return
		if (isEqual(val, ref)) return res
	},
	d: del,
	a: add,
	r: rep,
	m: function(res, path, from) {
		var val = get(res, from)
		if (val === undefined) throw Error(errorMsg('from', from))
		return add(del(res, from), path, val)
	},
	c: function(res, path, from) {
		var val = get(res, from)
		if (val === undefined) throw Error(errorMsg('from', from))
		return add(res, path, val)
	}
}

/**
 * Climbs and clones through the path before making change
 * @param {Object} obj object to be cloned and changed
 * @param {Array} pth patch item array of keys path
 * @return {Object} modified result object
 */
function cloneLeaf(obj, pth) {
	var len = pth.length -1 // stop before the last key
	for (var i=0; i < len; ++i) {
		if (!obj[pth[i]]) throw Error(errorMsg('path', pth.toString()))
		obj = obj[pth[i]] = shallowClone(obj[pth[i]])
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
		val = val[pth[i]]
	}
	return val
}
function rep(doc, pth, val) {
	if (val === undefined) throw Error(errorMsg('value', val))
	if (!pth.length) return val

	var res = shallowClone(doc),
			tgt = cloneLeaf(res, pth),
			key = pth[pth.length-1]

	if (tgt[key] === val) return doc //no change
	if (tgt[key] === undefined) throw Error(errorMsg('path key', key))
	tgt[key] = val
	return res
}
function del(doc, pth) {
	if (!pth.length) return
	var res = shallowClone(doc),
			tgt = cloneLeaf(res, pth),
			key = pth[pth.length-1]

	if (tgt[key] === undefined) throw Error(errorMsg('path key', key))
	if (Array.isArray(tgt)) tgt.splice(key, 1)
	else delete tgt[key]
	return res
}
function add(doc, pth, val) {
	if (val === undefined) throw Error(errorMsg('value', val))
	if (!pth.length) return val
	var res = shallowClone(doc),
			tgt = cloneLeaf(res, pth),
			key = pth[pth.length-1]
	if (Array.isArray(tgt)) {
		// avoid comparison operators to prevent non digit number string conversions (eg "1e0")
		if (key === '-' || key === '' + tgt.length) tgt.push(val)
		else if (tgt[key] === undefined) throw Error(errorMsg('path key', key))
		else tgt.splice(key, 0, val)
		return res
	}
	if (tgt[key] === val) return doc //no change
	tgt[key] = val
	return res
}
/**
 * @param {Object|Array} obj - object or array to be cloned
 * @returns {Object|Array} clone
 */
function shallowClone(obj) {
	return Array.isArray(obj) ? obj.slice() : Object.assign({}, obj)
}
