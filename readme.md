<!-- markdownlint-disable MD004 MD007 MD010 MD041	MD022 MD024	MD032 -->

# json-mini-patch

*JSON Patch RFC 6902 compliant* -
***small, simple, no dependencies, 3kb minified, 1kb gzip***

• [Why](#Why) • [What](#What) • [How](#How) • [License](#license) •

# Why

This is a bare-bone *JSON Patch* implementation with the internal parsed patch exposed.
This is useful for cases where additional processing and logic is required by store or database middleware.

When processing a JSON Patch, the string path must be parsed and unescaped into a series of object keys.
By seperating the processing and implementation of the patch, it is easier to use this implementation as a base for more complex object stores.

# What

```javascript
//CJS
var jsm = require('json-mini-patch')
var newState = jsm.jsonpatch(oldState, [{op: 'add', path: '/new/key', value: 'newValue'}]) //standard compliant
var minPatch = jsm.compress([{op: 'add', path: '/newKey', value: 'newValue'}]) //[['a', ['new','key'], 'newValue']]
var stdPatch = jsm.restore(minPatch) // back to the original standard patch
var newState = jsm.patch(oldState, minPatch) // patch
```

```javascript
//ES6
import {jsonpatch, compress, restore, patch} from 'json-mini-patch'
var newState = patch.std(oldState, [{op: 'add', path: '/new/key', value: 'newValue'}]) //standard compliant
var minPatch = patch.s2m([{op: 'add', path: '/newKey', value: 'newValue'}]) //[['a', ['new','key'], 'newValue']]
var stdPatch = patch.m2s(minPatch) // back to the original standard patch
var newState = patch.min(oldState, minPatch) // patch
```

## Features

* RFC 6902 compliant with the full test-suit used
* throws for non-compliant patches **but not for tests**. This allows test operations to prevent throwing
* operation are atomic and the source object is immutable. If a test fails the patch is canceled and the original object is returned
* under 4kb minified
* available in `cjs` (require), `es6` (import) or `browser` (script) formats

## API

* `jsonpatch(object, actions) => newObject` applies a JSON patch to the object
* `compress(actions) => [[o, p, v]]` returns a compressed patch.
  - `o`: operation 'a':add, 'r':replace, 'd':remove, 't':test, 'm':move, 'c':copy
  - `p`: array of path keys. `[]` for the root
  - `v`: `value` or `from` field depending on the operation
* `patch(object, compressed) => newObject` applies a parsed patch to the object
* `restore(compressed) => actions` converts a parsed patch back to a compliant JSON Patch

# License

Released under the [MIT License](http://www.opensource.org/licenses/MIT)
