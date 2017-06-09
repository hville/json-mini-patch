/* eslint no-console: 0, no-loop-func: 0*/
'use strict'

var ct = require('cotest'),
		isEqual = require('../').isEqual

ct('primitives', function() {
	ct('===', isEqual(1,1), true)
	ct('!', isEqual(1,2))
	ct('==', isEqual('a','a'), true)
	ct('!', isEqual('a','b'))
	ct('==', isEqual('',''), true)
	ct('!', isEqual('',false))
	ct('!', isEqual('',null))
	ct('!', isEqual('',0))
	ct('!', isEqual(false,null))
	ct('!', isEqual(false,0))
	ct('!', isEqual(null,0))})

ct('objects and arrays', function() {
	ct('===', isEqual([],[]), true)
	ct('!', isEqual([],{}))
	ct('==', isEqual([{}],[{}]), true)
	ct('!', isEqual([{}],[{a:0}]))
	ct('==', isEqual([{a:0}],[{a:0}]), true)})
