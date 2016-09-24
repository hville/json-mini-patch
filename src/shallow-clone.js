module.exports = shallowClone
/**
 * @param {Object|Array} obj - object or array to be cloned
 * @returns {Object|Array} clone
 */
function shallowClone(obj) {
	if (Array.isArray(obj)) return obj.slice()
	var clone={}
	for (var k in obj) clone[k] = obj[k] //no enum properties in JSON like objects
	return clone
}
