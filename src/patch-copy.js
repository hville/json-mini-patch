import {errorMsg} from './error-message'
import {add} from './patch-add'
import {get} from './patch-get'

export function copy(res, path, from) {
	var val = get(res, from)
	if (val === undefined) throw Error(errorMsg('from', from))
	return add(res, path, val)
}
