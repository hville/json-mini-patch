/* eslint no-console: 0, no-loop-func: 0*/
'use strict'
var ct = require('cotest'),
		jsonpatch = require('../').jsonpatch,
		setTests = require('../node_modules/json-patch-test-suite/tests.json'),
		setSpecs = require('../node_modules/json-patch-test-suite/spec_tests.json')

var skipDisabled = false

function tSet(set) {
	var result
	for (var i=0; i<set.length; ++i) {
		var src = set[i].doc
		if (skipDisabled && set[i].disabled) console.log('skiped disabled #', i)
		// must not fail
		else if (set[i].expected) {
			result = jsonpatch(src, set[i].patch)
			ct('{==}', result, set[i].expected)
			//t.ok(!result.err, 'result.err must be undefined')
			if (result.err) console.log('UNEXPECTED ERROR: ',result.err, set[i])
		}
		else if (set[i].error !== undefined) {
			ct('===', throws(function(){
				result = jsonpatch(src, set[i].patch)
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

	var res = jsonpatch(src, [{op:'test', path:'/a', value:'b'}, {op:'replace', path:'/a', value:'c'}])
	ct('===', res, ref, 'failed test returns untouched source')

	res = jsonpatch(src, [{op:'replace', path:'/a', value:'c'}, {op:'test', path:'/a', value:'b'}])
	ct('===', res, ref, 'failed test returns untouched source')
})
function throws(fcn) {
	try {
		fcn()
		return false
	} catch(e) {
		return true
	}
}
