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

		result = op(result, itm, path)
		if (result === undefined) return document //test failed, patch canceled
	}
	return result
}

var ops = {
	t: function(res, itm, path) {
		for (var i=0, val = res; i<path.length; ++i) {
			val = val[path[i]]
			if (val === undefined) return
		}
		if (isEqual(val, itm[2])) return res
	},
	d: function(res, itm, path) {
		return pathAction(keyDel, res, path)
	},
	a: function(res, itm, path) {
		return pathAction(keyAdd, res, path, itm[2])
	},
	r: function(res, itm, path) {
		return pathAction(keyRep, res, path, itm[2])
	},
	m: function(res, itm, path) {
		// validate that the from pointer has a vaild format
		var from = itm[2]
		if (!from) throw Error(errorMsg('from', itm[2]))

		// validate that the from pointer is a valid reference
		var val = res
		for (var i=0; i<from.length; ++i) {
			val = val[from[i]]
			if (val === undefined) throw Error(errorMsg('from', itm[2]))
		}
		res = pathAction(keyDel, res, from)
		return pathAction(keyAdd, res, path, val)
	},
	c: function(res, itm, path) {
		// validate that the from pointer has a vaild format
		var from = itm[2]
		if (!from) throw Error(errorMsg('from', itm[2]))

		// validate that the from pointer is a valid reference
		var val = res
		for (var i=0; i<from.length; ++i) {
			val = val[from[i]]
			if (val === undefined) throw Error(errorMsg('from', itm[2]))
		}
		return pathAction(keyAdd, res, path, val)
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
	if (!path.length) return value
	if (path.length === 1) return action(result, path[0], value)
	var pathLen = path.length - 2,
			branchKey = path[pathLen],
			leafKey = path[pathLen + 1],
			root = shallowClone(result),
			parent = root

	for (var i=0; i < pathLen; ++i) {
		parent = parent[path[i]] = shallowClone(parent[path[i]])
		if (!parent) throw Error(errorMsg('path', path.toString()))
	}
	// validate that the pointer is a valid reference up to the second last key
	var branch = parent[branchKey]
	if (!branch) throw Error(errorMsg('path', path.toString()))

	// remaining key validations are done at the branch operation level
	var newBranch = action(branch, leafKey, value)
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
/**
 * @param {Object|Array} obj - object or array to be cloned
 * @returns {Object|Array} clone
 */
function shallowClone(obj) {
	return Array.isArray(obj) ? obj.slice() : Object.assign({}, obj)
}
