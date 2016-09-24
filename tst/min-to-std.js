/* eslint no-console: 0, no-loop-func: 0*/
'use strict'

var ct = require('cotest'),
		norm2mini = require('../index').s2m,
		mini2norm = require('../index').m2s

var mini = [
	['t', ['t', 'tt'], 'tt'],
	['a', ['a', 'aa'], 'aa'],
	['r', ['r', 'rr'], 'rr'],
	['d', ['d', 'dd']],
	['m', ['m', 'mm'], ['mm', 'm']],
	['c', ['c', 'cc'], ['cc', 'c']],
	['a', [], '']
]

var norm = mini2norm(mini)
var mini2 = norm2mini(norm)
var norm2 = mini2norm(mini2)

ct('reversible', function() {
	ct('{==}', norm, norm2)
	ct('{==}', mini, mini2)
})
