import {getPointer} from './get-pointer'

/**
 * convert a mini patch to the standard JSON patch
 * @function
 * @param {Array} min - mini patch item to be converted
 * @return {Array} - equivalent JSON Patch
 */
export function restore(min) {
	return min.map(mini2patch)
}


/**
 * convert a mini patch item to standard JSON patch item
 * @param {Array} itm - mini patch item to be converted
 * @return {Object} - equivalent JSON Patch item
 */
function mini2patch(itm) {
	var ptr = getPointer(itm[1])
	switch (itm[0]) {
		case ('a'): return {op:'add', path: ptr, value: itm[2]}
		case ('r'): return {op:'replace', path: ptr, value: itm[2]}
		case ('d'): return {op:'remove', path: ptr}
		case ('t'): return {op:'test', path: ptr, value: itm[2]}
		case ('m'): return {op:'move', path: ptr, from: getPointer(itm[2])}
		case ('c'): return {op:'copy', path: ptr, from: getPointer(itm[2])}
	}
}
