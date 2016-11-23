var isEqual = require('./is-equal')
/**
 * @param	{Array} patch - JSON patch
 * @param	{Object} document - target JSON like object
 * @returns {Object} - result object
 */
var DKEY = 'd'

module.exports = function (document, patch) {
	var result = {}
	result[DKEY] = document

	for (var i=0; i< patch.length; ++i) {
		var itm = patch[i],
				path = prepend(DKEY, itm[1]),
				op = ops[itm[0]]

		if (!path) throw Error(errorMsg('path', path))
		if (!op) throw Error(errorMsg('op', itm[0]))

		result = op(result, itm, path, path.length === 1)
		if (result === null) return document //test failed, patch canceled
	}
	return result[DKEY]
}

var ops = {
	t: function(res, itm, path) {
		for (var i=0, val = res; i<path.length; ++i) {
			val = val[path[i]]
			if (val === undefined) return null
		}
		return isEqual(val, itm[2]) ? res : null
	},
	d: function(res, itm, path, isRoot) {
		return isRoot ? keyDel(res, DKEY) : pathAction(keyDel, res, path)
	},
	a: function(res, itm, path, isRoot) {
		return isRoot ? keyAdd(res, DKEY, itm[2]) : pathAction(keyAdd, res, path, itm[2])
	},
	r: function(res, itm, path, isRoot) {
		return isRoot ? keyRep(res, DKEY, itm[2]) : pathAction(keyRep, res, path, itm[2])
	},
	m: function(res, itm, path, isRoot) {
		// validate that the from pointer has a vaild format
		var from = prepend(DKEY, itm[2])
		if (!from) throw Error(errorMsg('from', itm[2]))

		// validate that the from pointer is a valid reference
		var val = res
		for (var i=0; i<from.length; ++i) {
			val = val[from[i]]
			if (val === undefined) throw Error(errorMsg('from', itm[2]))
		}
		res = from.length === 1 ? keyDel(res, DKEY) : pathAction(keyDel, res, from)
		return isRoot ? keyAdd(res, DKEY, val) : pathAction(keyAdd, res, path, val)
	},
	c: function(res, itm, path, isRoot) {
		// validate that the from pointer has a vaild format
		var from = prepend(DKEY, itm[2])
		if (!from) throw Error(errorMsg('from', itm[2]))

		// validate that the from pointer is a valid reference
		var val = res
		for (var i=0; i<from.length; ++i) {
			val = val[from[i]]
			if (val === undefined) throw Error(errorMsg('from', itm[2]))
		}
		return isRoot ? keyAdd(res, DKEY, val) : pathAction(keyAdd, res, path, val)
	}
}
/**
 * Climbs and clones through the path before making change
 * @param {Function} action operation to be performed on leaf
 * @param {Object} result object to be cloned and changed
 * @param {Array} path patch item array of keys path
 * @param {?} [value] operation value
 * @return {Object} modified result object
 */
function pathAction(action, result, path, value) {
	var leafKey = path[path.length - 1],
			root = shallowClone(result),
			parent = root,
			branchKey,
			branch,
			newBranch

	for (var i=0; i<path.length-2; ++i) {
		parent[path[i]] = shallowClone(parent[path[i]])
		parent = parent[path[i]]
		if (parent === undefined) throw Error(errorMsg('path', path.toString()))
	}
	branchKey = path[i]

	// validate that the pointer is a valid reference up to the second last key
	branch = parent[branchKey]
	if (!branch || typeof branch !== 'object') throw Error(errorMsg('path', path.toString()))

	// remaining key validations are done at the branch operation level
	newBranch = action(branch, leafKey, value)
	if (newBranch === branch) return result

	parent[branchKey] = newBranch
	return root
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

function keyRep(obj, key, val) {
	if (val === undefined) throw Error(errorMsg('value', val))
	if (obj[key] === val) return obj
	if (obj[key] === undefined) throw Error(errorMsg('path key', key))

	var cln = shallowClone(obj)
	cln[key] = val
	return cln
}

function keyDel(obj, key) {
	if (obj[key] === undefined) throw Error(errorMsg('path key', key))

	var clone
	if (Array.isArray(obj)) {
		clone = obj.slice()
		clone.splice(key, 1)
	} else {
		clone = {}
		for (var i=0, keys=Object.keys(obj); i<keys.length; ++i) {
			if (keys[i] !== key) clone[keys[i]] = obj[keys[i]]
		}
	}
	return clone
}

function keyAdd(obj, key, val) {
	if (val === undefined) throw Error(errorMsg('value', val))
	var result = shallowClone(obj)

	if (Array.isArray(obj)) {
		// avoid comparison operators to prevent non digit number string conversions (eg "1e0")
		if (key === '-' || key === '' + obj.length) {
			result.push(val)
			return result
		}
		if (obj[key] === undefined) throw Error(errorMsg('path key', key))

		result.splice(key, 0, val)
		return result
	}

	if (obj[key] === val) return obj
	result[key] = val
	return result
}
function prepend(key, arr) {
	for (var i=0, res=[key]; i<arr.length; ++i) res[i+1] = arr[i]
	return res
}
/**
 * @param {Object|Array} obj - object or array to be cloned
 * @returns {Object|Array} clone
 */
function shallowClone(obj) {
	return Array.isArray(obj) ? obj.slice() : Object.assign({}, obj)
}
