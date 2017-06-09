import {shallowClone, cloneLeaf} from './clone'
import {errorMsg} from './error-message'
import {isEqual} from './is-equal'

export function put(doc, pth, val) {
	if (val === undefined) throw Error(errorMsg('value', val))
	if (!pth.length) return val

	var res = shallowClone(doc),
			tgt = cloneLeaf(res, pth),
			key = pth[pth.length-1]

	if (isEqual(tgt[key], val)) return doc //no change
	if (tgt[key] === undefined) throw Error(errorMsg('path key', key))
	tgt[key] = val
	return res
}
