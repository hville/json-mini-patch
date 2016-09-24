var ptr2pth = require('./pointer-to-keys')

module.exports = stdToMin

/**
 * convert JSON Patch to a mini patch
 * @param {Array<Object>} std standard compliant JSON patch
 * @return {Array<Array>|undefined} converted patch
 */
function stdToMin(std) {
	for (var i=0, res=[]; i<std.length; ++i) {
		res[i] = stdToMinItem(std[i])
		if (!res[i]) return
	}
	return res
}
/**
 * @param {Object} itm patch item to parse
 * @return {Array|undefined} parsed patch
 */
function stdToMinItem(itm) {
	var pth = ptr2pth(itm.path)
	if (itm.value && itm.from) return
	switch (itm.op) {
		case 'add': return ['a', pth, itm.value]
		case 'replace': return ['r', pth, itm.value]
		case 'remove': return ['d', pth]
		case 'test': return ['t', pth, itm.value]
		case 'move': return ['m', pth, ptr2pth(itm.from)]
		case 'copy': return ['c', pth, ptr2pth(itm.from)]
	}
}
