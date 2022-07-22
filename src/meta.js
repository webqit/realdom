
/**
 * @imports
 */
import { _isNumeric, _isObject } from '@webqit/util/js/index.js';
import { _set, _get, _del, _has, _merge } from '@webqit/util/obj/index.js';

/**
 * A wq's meta tag props reader.
 *  
 * @param String name
 * @param Bool	 readWrite
 * 
 * @return Object
 */
export default function meta( name, readWrite = false ) {
    const window = this;
    const metaInstance = {};

    // Initialize reader
    if ( !(metaInstance.el = window.document.head.querySelector( 'meta[name="oohtml"]' ) ) && readWrite ) {
        metaInstance.el = window.document.createElement( 'meta' );
        metaInstance.el.setAttribute( 'name', name );
        window.document.head.append( metaInstance.el );
    }
    if ( metaInstance.el ) {
        metaInstance.vars = (metaInstance.el.getAttribute( 'content' ) || '' ).split( ';' ).filter( v => v ).reduce( ( _metaVars, directive ) => {
            const directiveSplit = directive.split( '=' ).map( d => d.trim() );
            _set( _metaVars, directiveSplit[ 0 ].split( '.' ), directiveSplit[ 1 ] === 'true' 
                ? true : (directiveSplit[ 1 ] === 'false' ? false : (
                    _isNumeric( directiveSplit[ 1 ] ) ? parseInt( directiveSplit[ 1 ] ) : directiveSplit[ 1 ]
                ) )
            );
            return _metaVars;
        }, {} );
    }

    // Read prop...
    metaInstance.get = function(prop) {
        return _get(this.vars, prop.split('.'));
    }

    // Write prop...
    metaInstance.set = function(prop, val = null, asDefaults = false) {
        var props = _isObject(prop) ? prop : {[prop]: val === true ? 'true' : val};
        asDefaults = arguments.length < 3 ? val : asDefaults;
        Object.keys(props).forEach(name => {
            if (props[name] === false) {
                _del(this.vars, name.split('.'));
            } else if (_isObject(props[name])) {
                Object.keys(props[name]).forEach(_prop => {
                    var _path = (name + '.' + _prop).split('.');
                    if (!asDefaults || !_has(this.vars, _path)) {
                        _set(this.vars, _path, props[name][_prop]);
                    }
                });
            } else {
                var _path = name.split('.');
                if (!asDefaults || !_has(this.vars, _path)) {
                    _set(this.vars, _path, props[name]);
                }
            }
        });
        if (readWrite) {
            const flatten = (base, obj) => Object.keys(obj).reduce((arr, name) => {
                var path = (base ? base + '.' : '') + name;
                if (_isObject(obj[name])) {
                    arr.push(...flatten(path, obj[name]));
                } else {
                    arr.push(path + '=' + obj[name]);
                }
                return arr;
            }, []);
            this.el.setAttribute('content', flatten('', this.vars).join(';'));
        }
        return true;
    }

    // Write prop...
    metaInstance.defaults = function(prop, val = null) {
        return this.set(prop, val, true);
    };

    return metaInstance;
}