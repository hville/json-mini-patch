module.exports = isEqual

/**
 * deep Equal check on JSON-like objects
 * @param {!Object|!Array} obj - object to check
 * @param {!Object|!Array} ref - the reference
 * @return {boolean|void} truthy if equal
 */
function isEqual(obj, ref) {
	var cO = cType(obj),
			cR = cType(ref)
	if (cO !== cR) return
	switch (cO) {
		case Array:
			if (obj.length !== ref.length) return
			for (var i=0; i<obj.length; ++i) if (!isEqual(obj[i], ref[i])) return
			return true
		case Object:
			var ko = Object.keys(obj).sort(),
					kr = Object.keys(ref).sort()
			if (ko.length !== kr.length) return
			for (i=0; i<ko.length; ++i) if (!isEqual(obj[ko[i]], ref[kr[i]])) return
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
