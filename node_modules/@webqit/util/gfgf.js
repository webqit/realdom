
/**
 * @imports
 */
import * as Arr from './Arr.js';
import * as Js from './Js.js';
import * as Num from './Num.js';
import * as Obj from './Obj.js';
import * as Str from './Str.js';
import _objWith from './obj/with.js';

const unprefix = (a, b = {}) => Object.keys(a).reduce((b, funcName) => _objWith(b, funcName.substr(1), a[funcName]), b);
const extend = (prototype, module, prefix = '') => Object.keys(module).reduce((prototype, funcName) => _objWith(prototype, prefix + funcName, function() {
	return module[funcName](this, ...arguments);
}), prototype);

/**
 * @exports
 */
export {
	Arr,
	Js,
	Num,
	Obj,
	Str,
	unprefix,
	extend,
};