/**
 * deep Equal check on JSON-like objects
 * @function
 * @param {!Object|!Array} obj - object to check
 * @param {!Object|!Array} ref - the reference
 * @return {boolean|void} truthy if equal
 */
export function isEqual(obj, ref) {
	var cO = cType(obj),
			cR = cType(ref)
	if (cO !== cR) return
	switch (cO) {
		case Array:
			if (obj.length !== ref.length) return
			for (var i=0; i<obj.length; ++i) if (!isEqual(obj[i], ref[i])) return
			return true
		case Object:
			var ko = Object.keys(obj)
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
