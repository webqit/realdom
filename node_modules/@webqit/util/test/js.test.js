 
/**
 * @imports
 */
import { expect } from 'chai';
import * as Js from '../js/index.js';

describe(`JS Processing`, function() {

    describe(`mixin()`, function() {
 
        var methodACalled = 0, methodBCalled = 0, methodCCalled = 0;
        class A {
            methodA() {
                methodACalled ++;
            }
        }
        class B {
            methodB() {
                methodBCalled ++;
            }
        }
        class Bx extends B {}
        class By extends B {}

        class C extends Js._mixin(A, B) {
            methodC(callSuper = false) {
                if (callSuper) {
                    super.methodA();
                    super.methodB();
                }
                methodCCalled ++;
            }
        }

        const _C = new C;

        it(`Should ensure own and inheritted methods are called.`, function() {
            _C.methodA();
            _C.methodB();
            _C.methodC();
            expect(methodACalled).to.be.a('number').that.equals(1);
            expect(methodBCalled).to.be.a('number').that.equals(1);
            expect(methodCCalled).to.be.a('number').that.equals(1);
        });

        it(`Should ensure all ancestor methods are called on super[methodName]().`, function() {
            _C.methodC(true);
            expect(methodACalled).to.be.a('number').that.equals(2);
            expect(methodBCalled).to.be.a('number').that.equals(2);
            expect(methodCCalled).to.be.a('number').that.equals(2);
        });

        it(`Should ensure the native instanceof syntax works.`, function() {
            expect(_C instanceof A).to.be.true;
            expect(_C instanceof B).to.be.true;
            expect(_C instanceof C).to.be.true;
            expect(_C instanceof By).to.be.false;
            expect((new Bx) instanceof By).to.be.false;
        });

    });

    describe(`internals()`, function() {
 
        it(`Should ensure zero or more namespaces work.`, function() {
            var obj = {};
            expect(Js._internals(obj)).to.be.instanceOf(Map);
            expect(Js._internals(obj, 'a', 'b')).to.be.instanceOf(Map);
            expect(Js._internals(obj, 'a', 'c')).to.be.instanceOf(Map);
            expect(Js._internals(obj, 'a', 'd', false)).to.be.instanceOf(Map); // FALSE means: Return orphan Map if not exists
            expect(Js._internals(obj, 'a', 'e', false)).to.be.instanceOf(Map); // FALSE means: Return orphan Map if not exists
            expect(Js._internals(obj, 'a').size).to.eq(2);
            expect(Js._internals(obj).size).to.eq(1);
        });

    });


    /**

    Object.prototype.toString.call({});

    const obj = {
        [Symbol.toPrimitive](hint) {
            switch (hint) {
                case 'number':
                    return 123;
                case 'string':
                    return 'str';
                case 'default':
                    return 'default';
                default:
                    throw new Error();
            }
        }
    };
    console.log(2 * obj); // 246
    console.log(3 + obj); // '3default'
    console.log(obj == 'default'); // true
    console.log(String(obj)); // 'str'

    class Bar {
        get [Symbol.toStringTag]() {
          return 'Bar';
        }
    }
    console.log(new Bar().toString()); // [object Bar]

    function myIndexOf(arr, elem) {
        return arr.findIndex(x => Object.is(x, elem));
    }

    //> Object.is(NaN, NaN)
    true
    //> Object.is(-0, +0)
    false

    //If you want the clone to have the same prototype as the original, you can use Object.getPrototypeOf() and Object.create():

    function clone(orig) {
        const origProto = Object.getPrototypeOf(orig);
        return Object.assign(Object.create(origProto), orig);
    }

    const DEFAULTS = {
        logLevel: 0,
        outputFormat: 'html'
    };
    function processContent(options) {
        options = Object.assign({}, DEFAULTS, options); // (A)
        //···
    }
    //In line A, we created a fresh object, copied the defaults into it and then copied options into it, overriding the defaults. Object.assign() returns the result of these operations, which we assign to options.


    //This is how you would copy all own properties (not just enumerable ones), while correctly transferring getters and setters and without invoking setters on the target:

    function copyAllOwnProperties(target, ...sources) {
        for (const source of sources) {
            for (const key of Reflect.ownKeys(source)) {
                const desc = Object.getOwnPropertyDescriptor(source, key);
                Object.defineProperty(target, key, desc);
            }
        }
        return target;
    }



    const Storage = Sup => class extends Sup {
        save(database) { }
    };
    const Validation = Sup => class extends Sup {
        validate(schema) { }
    };
    //Here, we profit from the operand of the extends clause not being a fixed identifier, but an arbitrary expression. With these mixins, Employee is created like this:
    
    class Employee extends Storage(Validation(Person)) { }


    get notifier() {
    delete this.notifier;
    return this.notifier = document.getElementById('bookmarked-notification-anchor');
    },
    */

});