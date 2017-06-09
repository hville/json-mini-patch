import {shallowClone, cloneLeaf} from './clone'
import {errorMsg} from './error-message'
import {isEqual} from './is-equal'

export function add(doc, pth, val) {
	if (val === undefined) throw Error(errorMsg('value', val))
	if (!pth.length) return val
	var res = shallowClone(doc),
			tgt = cloneLeaf(res, pth),
			key = pth[pth.length-1]
	if (Array.isArray(tgt)) {
		// avoid comparison operators to prevent non digit number string conversions (eg "1e0")
		if (key === '-' || key === '' + tgt.length) tgt.push(val)
		else if (tgt[key] === undefined) throw Error(errorMsg('path key', key))
		else tgt.splice(key, 0, val)
		return res
	}
	if (isEqual(tgt[key], val)) return doc //no change
	tgt[key] = val
	return res
}
