module.exports = keysToPointer

/**
 * convert an array of keys path to a JSON pointer
 * @param {Array} path - array of keys
 * @return {string} JSON pointer
 */
function keysToPointer(path) {
	for (var i=0, res=''; i<path.length; ++i) {
		res += '/' + escape(path[i])
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
		: key[i]
	}
	return res
}
