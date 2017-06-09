import {errorMsg} from './error-message'

/**
 * @param {Object|Array} obj - object or array to be cloned
 * @returns {Object|Array} clone
 */
export function shallowClone(obj) {
	return Array.isArray(obj) ? obj.slice() : Object.assign({}, obj)
}


/**
 * Climbs and clones through the path before making change
 * @param {Object} obj object to be cloned and changed
 * @param {Array} pth patch item array of keys path
 * @return {Object} modified result object
 */
export function cloneLeaf(obj, pth) {
	var len = pth.length -1 // stop before the last key
	for (var i=0; i < len; ++i) {
		if (!obj[pth[i]]) throw Error(errorMsg('path', pth.toString()))
		obj = obj[pth[i]] = shallowClone(obj[pth[i]])
	}
	return obj
}
