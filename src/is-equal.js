module.exports = isEqual

/**
 * deep Equal check on JSON-like objects
 * @param {!Object|!Array} obj - object to check
 * @param {!Object|!Array} ref - the reference
 * @return {boolean|void} truthy if equal
 */
function isEqual(obj, ref) {
	if (obj === ref) return true
	var cO = cType(obj),
			cR = cType(ref)
	if (cO === cR) {
		if (cO === Array && obj.length === ref.length) {
			for (var i=0; i<obj.length; ++i) if (!isEqual(obj[i], ref[i])) return false
			return true
		}
		if (cO === Object) {
			var ko = Object.keys(obj).sort(),
					kr = Object.keys(ref).sort()
			if (ko.length !== kr.length) return false
			for (i=0; i<ko.length; ++i) if (!isEqual(obj[ko[i]], ref[kr[i]])) return false
			return true
		}
	}
	return false
}
/**
 * @param {Object|Array} obj - object to test
 * @return {Object|undefined} object Constructor type
 */
function cType(obj) {
	if (!obj) return
	if (Array.isArray(obj)) return Array
	if (obj.constructor === Object) return Object
	if (!obj.constructor && typeof obj === 'object') return Object
}
