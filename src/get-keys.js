/**
 * convert JSON Pointer RFC 6901 to array of keys
 * @function
 * @param {string} ptr - JSON Pointer RFC 6901
 * @return {!Array} array of keys
 */
export function getKeys(ptr) {
	var idx = -1,
			arr = []
	for (var i=0; i<ptr.length; ++i) {
		if (ptr[i] === '/') arr[++idx] = ''
		else if (ptr[i] === '~') arr[idx] += ptr[++i] === '0' ? '~'
			: ptr[i] === '1' ? '/'
			: ''
		else arr[idx] += ptr[i]
	}
	return arr
}
