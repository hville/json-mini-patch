export function get(doc, pth) {
	for (var i=0, val = doc; i<pth.length; ++i) {
		if (!val) return
		val = val[pth[i]]
	}
	return val
}
