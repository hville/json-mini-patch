import {get} from './patch-get'
import {isEqual} from './is-equal'

export function test(res, keys, ref) {
	var val = get(res, keys)
	if (val === undefined) return
	if (isEqual(val, ref)) return res
}
