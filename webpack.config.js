var ClosureCompiler = require('google-closure-compiler-js').webpack;
var path = require('path');

module.exports = {
	entry: [
		path.join(__dirname, './src/patch-std.js')
	],
	output: {
		path: path.join(__dirname, 'bld'),
		filename: 'app.min.js'
	},
	plugins: [
		new ClosureCompiler({
			options: {
				languageIn: 'ECMASCRIPT5',
				languageOut: 'ECMASCRIPT5',
				compilationLevel: 'ADVANCED',
				warningLevel: 'VERBOSE',
			},
		})
	]
}
