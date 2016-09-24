var min = require('./src/patch-min'),
		s2m = require('./src/std-to-min'),
		m2s = require('./src/min-to-std')

module.exports = {
	std: std,
	min: min,
	s2m: s2m,
	m2s: m2s
}

function std(doc, jsonpatch) {
	return min(doc, s2m(jsonpatch))
}
