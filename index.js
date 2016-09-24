var min = require('./src/patch-min'),
		s2m = require('./src/std-to-min'),
		m2s = require('./src/min-to-std'),
		p2k = require('./src/keys-to-pointer'),
		k2p = require('./src/pointer-to-keys')

module.exports = {
	std: std,
	min: min,
	s2m: s2m,
	m2s: m2s,
	p2k: p2k,
	k2p: k2p
}

function std(doc, jsonpatch) {
	return min(doc, s2m(jsonpatch))
}
