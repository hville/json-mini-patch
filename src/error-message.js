/**
 * Format errors
 * @param {string} key patch item key when error triggered
 * @param {string} [val] patch item key value when error triggered
 * @return {string} error message
 */
export function errorMsg(key, val) {
	return 'Patch item failed at ' + key + ':' + JSON.stringify(val)
}
