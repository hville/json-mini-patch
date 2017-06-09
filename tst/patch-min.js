/* eslint no-console: 0, no-loop-func: 0*/
'use strict'
var ct = require('cotest'),
		setTests = require('../node_modules/json-patch-test-suite/tests.json'),
		setSpecs = require('../node_modules/json-patch-test-suite/spec_tests.json'),
		patch = require('../').patch,
		compress = require('../').compress

var skipDisabled = false

var patcher = function(src, ptc) {
	return patch(src, compress(ptc))
}

function tSet(set) {
	var result
	for (var i=0; i<set.length; ++i) {
		var src = set[i].doc
		if (skipDisabled && set[i].disabled) console.log('skiped disabled #', i)
		// must not fail
		else if (set[i].expected) {
			result = patcher(src, set[i].patch)
			ct('{==}', result, set[i].expected)
			if (result.err) console.log('UNEXPECTED ERROR: ',result.err, set[i])
		}
		else if (set[i].error !== undefined) {
			ct('===', throws(function() {
				result = patcher(src, set[i].patch)
				if (result === src && set[i].patch[0].op === 'test') throw 'ok'
			}), true)
		}
	}
}

ct('tests', function() {
	tSet(setTests)
})

ct('spec_tests', function() {
	tSet(setSpecs)
})

ct('edge cases', function() {
	var ref = {a:'a'}
	var src = ref

	var res = patch(src, [['t', ['a'], 'b'], ['r', ['a'], 'c']])
	ct('===', res, ref, 'failed test returns untouched source')

	res = patch(src, [['r', ['a'], 'mustfail'], ['t', ['a'], 'notPassed']])
	ct('===',res.a, 'a') //unchanged
	ct('===',res, ref) //uncloned
})

ct('internal features', function() {
	var ref = {a:'a', b:[0]}
	var src = ref

	var res = patch(src, [['r', ['a'], 'a']])
	ct('===', res, ref, 'patching same value return un-cloned initial object')
	res = patch(src, [['r', ['b'], ref.b]])
	ct('===', res, ref, 'patching same value return un-cloned initial object')
	res = patch(src, [['r', ['b', 0], 0]])
	ct('===', res, ref, 'patching same value return un-cloned initial object')//

})

function throws(fcn) {
	try {
		fcn()
		return false
	} catch(e) {
		return true
	}
}
