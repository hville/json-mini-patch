/* eslint no-console: 0, no-loop-func: 0*/
'use strict'

var ct = require('cotest'),
		isEqual = require('../src/is-equal')

ct('primitives', function() {
	ct('===', isEqual(1,1), true)
	ct('==', isEqual(1,2), false)
	ct('==', isEqual('a','a'), true)
	ct('==', isEqual('a','b'), false)
	ct('==', isEqual('',''), true)
	ct('==', isEqual('',false), false)
	ct('==', isEqual('',null), false)
	ct('==', isEqual('',0), false)
	ct('==', isEqual(false,null), false)
	ct('==', isEqual(false,0), false)
	ct('==', isEqual(null,0), false)})

ct('objects and arrays', function() {
	ct('===', isEqual([],[]), true)
	ct('==', isEqual([],{}), false)
	ct('==', isEqual([{}],[{}]), true)
	ct('==', isEqual([{}],[{a:0}]), false)
	ct('==', isEqual([{a:0}],[{a:0}]), true)})
