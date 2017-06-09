import {test} from './patch-test'
import {add} from './patch-add'
import {put} from './patch-put'
import {del} from './patch-del'
import {move} from './patch-move'
import {copy} from './patch-copy'
import {errorMsg} from './error-message'

var ops = {t: test, a: add, r: put, d: del, m: move, c: copy}

/**
 * @function
 * @param	{Object} document - target JSON like object
 * @param	{Array} actions - JSON patch
 * @returns {Object} - result object
 */
export function patch(document, actions) {
	var result = document

	for (var i=0; i< actions.length; ++i) {
		var itm = actions[i],
				path = itm[1],
				op = ops[itm[0]]
		if (!path) throw Error(errorMsg('path', path))
		if (!op) throw Error(errorMsg('op', itm[0]))

		result = op(result, path, itm[2])
		if (result === undefined) return document //test failed, patch canceled
	}
	return result
}
