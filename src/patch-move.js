import {errorMsg} from './error-message'
import {add} from './patch-add'
import {del} from './patch-del'
import {get} from './patch-get'

export function move(res, path, from) {
	var val = get(res, from)
	if (val === undefined) throw Error(errorMsg('from', from))
	return add(del(res, from), path, val)
}
