/* eslint no-console: 0, no-loop-func: 0*/
'use strict'

var ct = require('cotest'),
		compress = require('../').compress,
		restore = require('../').restore

var mini = [
	['t', ['t', 'tt'], 'tt'],
	['a', ['a', 'aa'], 'aa'],
	['r', ['r', 'rr'], 'rr'],
	['d', ['d', 'dd']],
	['m', ['m', 'mm'], ['mm', 'm']],
	['c', ['c', 'cc'], ['cc', 'c']],
	['a', [], '']
]

var norm = restore(mini)
var mini2 = compress(norm)
var norm2 = restore(mini2)

ct('reversible', function() {
	ct('{==}', norm, norm2)
	ct('{==}', mini, mini2)
})
