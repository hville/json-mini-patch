import {patch} from './src/patch-min'
import {compress} from './src/compress'

export function jsonpatch(doc, actions) {
	return patch(doc, compress(actions))
}

export {patch} from './src/patch-min'
export {compress} from './src/compress'
export {restore} from './src/restore'
export {getPointer} from './src/get-pointer'
export {getKeys} from './src/get-keys'
export {isEqual} from './src/is-equal'

