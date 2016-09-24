module.exports = function(mini) {
	return mini.map(mini2patch)
}
/**
 * convert a mini patch to the standard JSON patch
 * @param {Array} itm - mini patch item to be converted
 * @return {Object} - equivalent JSON Patch item
 */
function mini2patch(itm) {
	var ptr = pth2ptr(itm[1])
	switch (itm[0]) {
		case ('a'): return {op:'add', path: ptr, value: itm[2]}
		case ('r'): return {op:'replace', path: ptr, value: itm[2]}
		case ('d'): return {op:'remove', path: ptr}
		case ('t'): return {op:'test', path: ptr, value: itm[2]}
		case ('m'): return {op:'move', path: ptr, from: pth2ptr(itm[2])}
		case ('c'): return {op:'copy', path: ptr, from: pth2ptr(itm[2])}
	}
}
/**
 * convert an array of keys path to a JSON pointer
 * @param {Array} path - array of keys
 * @return {string} JSON pointer
 */
function pth2ptr(path) {
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
