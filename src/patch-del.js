import {shallowClone, cloneLeaf} from './clone'
import {errorMsg} from './error-message'

export function del(doc, pth) {
	if (!pth.length) return
	var res = shallowClone(doc),
			tgt = cloneLeaf(res, pth),
			key = pth[pth.length-1]

	if (tgt[key] === undefined) throw Error(errorMsg('path key', key))
	if (Array.isArray(tgt)) tgt.splice(key, 1)
	else delete tgt[key]
	return res
}
