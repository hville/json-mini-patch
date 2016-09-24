module.exports = pointerToKeys

function pointerToKeys(ptr) {
	var idx = -1,
			arr = [],
			i = -1
	while (++i < ptr.length) {
		if (ptr[i] === '/') arr[++idx] = ''
		else if (ptr[i] === '~') arr[idx] += ptr[++i] === '0' ? '~'
			: ptr[i] === '1' ? '/'
			: undefined
		else arr[idx] += ptr[i]
	}
	return arr
}
