 
/**
 * @imports
 */
import { expect } from 'chai';
import * as Arr from '../arr/index.js';

describe(`Array Processing`, function() {

    describe(`after()`, function() {
 
        it(`With two identical arrays`, function() {
            expect(Arr._after(['a', 'b', 'c'], ['a', 'b', 'c'])).to.be.empty;
        });

        it(`With two left-identical arrays of longer operand A`, function() {
           expect(Arr._after(['a', 'b', 'c', 'd'], ['a', 'b', 'c'])).to.be.an('array').that.eql(['d']);
        });

        it(`With two left-identical arrays of longer operand B`, function() {
            expect(Arr._after(['a', 'b', 'c'], ['a', 'b', 'c', 'd'])).to.be.empty;
        });

    });

    describe(`afterLast()`, function() {
 
        it(`With two identical arrays`, function() {
            expect(Arr._afterLast(['a', 'b', 'c'], ['a', 'b', 'c'])).to.be.empty;
        });

        it(`With two left-identical arrays of longer operand A`, function() {
           expect(Arr._afterLast(['a', 'b', 'c', 'd'], ['a', 'b', 'c'])).to.be.an('array').that.eql(['d']);
        });

        it(`With two double-identical arrays of longer operand A`, function() {
            expect(Arr._afterLast(['a', 'b', 'c', 'a', 'b', 'c', 'd', 'e'], ['a', 'b', 'c'])).to.be.an('array').that.eql(['d', 'e']);
        });

    });

    describe(`before()`, function() {
 
        it(`With two identical arrays`, function() {
            expect(Arr._before(['a', 'b', 'c'], ['a', 'b', 'c'])).to.be.empty;
        });

        it(`With two right-identical arrays of longer operand A`, function() {
           expect(Arr._before(['#', 'a', 'b', 'c'], ['a', 'b', 'c'])).to.be.an('array').that.eql(['#']);
        });

        it(`With two right-identical arrays of longer operand B`, function() {
            expect(Arr._before(['a', 'b', 'c'], ['#', 'a', 'b', 'c'])).to.be.empty;
        });

    });

    describe(`beforeLast()`, function() {
 
        it(`With two identical arrays`, function() {
            expect(Arr._beforeLast(['a', 'b', 'c'], ['a', 'b', 'c'])).to.be.empty;
        });

        it(`With two right-identical arrays of longer operand A`, function() {
           expect(Arr._beforeLast(['#', 'a', 'b', 'c'], ['a', 'b', 'c'])).to.be.an('array').that.eql(['#']);
        });

        it(`With two double-identical arrays of longer operand A`, function() {
            expect(Arr._beforeLast(['a', 'b', 'c', 'a', 'b', 'c'], ['a', 'b', 'c'])).to.be.an('array').that.eql(['a', 'b', 'c']);
        });

    });

    describe(`crossJoin()`, function() {
 
        it(`With plain-segment path`, function() {
            expect(Arr._crossJoin(['a', 'b', 'c'])).to.be.an('array').that.eql([ ['a', 'b', 'c'] ]);
        });

        it(`With two plain- and one compound-segment path`, function() {
            expect(Arr._crossJoin(['a', 'b', ['c1', 'c2']])).to.be.an('array').that.eql([ ['a', 'b', 'c1'], ['a', 'b', 'c2'] ]);
        });

        it(`With two plain- and one compound-segment path`, function() {
            expect(Arr._crossJoin(['a', 'b', ['c1', 'c2', 'c3']])).to.be.an('array').that.eql([ ['a', 'b', 'c1'], ['a', 'b', 'c2'], ['a', 'b', 'c3'] ]);
        });

    });

    describe(`endsWith()`, function() {
 
        it(`With two identical arrays`, function() {
            expect(Arr._endsWith(['a', 'b', 'c'], ['a', 'b', 'c'])).to.be.true;
        });

        it(`With two right-identical arrays of longer operand A`, function() {
           expect(Arr._endsWith(['#', 'a', 'b', 'c'], ['a', 'b', 'c'])).to.be.true;
        });

        it(`With two right-identical arrays of longer operand B`, function() {
            expect(Arr._endsWith(['a', 'b', 'c'], ['#', 'a', 'b', 'c'])).to.be.false;
        });
 
        it(`With two identical arrays - using the "dotSafe" parameter`, function() {
            expect(Arr._endsWith(['a', 'b', 'c'], ['a', 'b', 'c'], true)).to.be.true;
        });

        it(`With two right-identical arrays of longer operand A - using the "dotSafe" parameter`, function() {
           expect(Arr._endsWith(['#', 'a', 'b', 'c'], ['a', 'b', 'c'], true)).to.be.true;
        });

        it(`With two right-identical arrays of longer operand B - using the "dotSafe" parameter`, function() {
            expect(Arr._endsWith(['a', 'b', 'c'], ['#', 'a', 'b', 'c'], true)).to.be.false;
        });

    });

    describe(`equals()`, function() {

        it(`With two identical arrays`, function() {
            expect(Arr._equals(['a', 'b', 'c'], ['a', 'b', 'c'])).to.be.true;
        });

        it(`With two non-identical arrays`, function() {
            expect(Arr._equals(['a', 'b', 'c'], ['a', 'b', 'c', 'd'])).to.be.false;
        });

        it(`With two identical arrays - using the "dotSafe" parameter`, function() {
            expect(Arr._equals(['a', 'b', 'c'], ['a', 'b', 'c'], true)).to.be.true;
        });

        it(`With two non-identical arrays - using the "dotSafe" parameter`, function() {
            expect(Arr._equals(['a', 'b', 'c'], ['a', 'b', 'c', 'd'], true)).to.be.false;
        });

    });

    describe(`equals2D()`, function() {

        it(`With two identical arrays`, function() {
            expect(Arr._equals2D([['a', 'b', 'c'], ['d', 'five', 'six']], [['a', 'b', 'c'], ['d', 'five', 'six']])).to.be.true;
        });

        it(`With two non-identical arrays`, function() {
            expect(Arr._equals2D([['a', 'b', 'c'], ['d', 'five', 'six']], [['d', 'five', 'six'], ['a', 'b', 'c', 'd']])).to.be.false;
        });

        it(`With two identical arrays - using the "dotSafe" parameter`, function() {
            expect(Arr._equals2D([['a', 'b', 'c'], ['d', 'five', 'six']], [['a', 'b', 'c'], ['d', 'five', 'six']], true)).to.be.true;
        });

        it(`With two non-identical arrays - using the "dotSafe" parameter`, function() {
            expect(Arr._equals2D([['a', 'b', 'c'], ['d', 'five', 'six']], [['d', 'five', 'six'], ['a', 'b', 'c', 'd']], true)).to.be.false;
        });

    });

    describe(`indexOfSet()`, function() {
 
        it(`With two identical arrays`, function() {
            expect(Arr._indexOfSet(['a', 'b', 'c'], ['a', 'b', 'c'])).to.be.a('number').that.eql(0);
        });

        it(`With two left-and-right-identical arrays of longer operand A`, function() {
            expect(Arr._indexOfSet(['a', 'b', 'c', '|', 'a', 'b', 'c'], ['a', 'b', 'c'])).to.be.a('number').that.eql(0);
        });
 
        it(`With two left-identical arrays of longer operand B`, function() {
            expect(Arr._indexOfSet(['#', 'a', 'b', 'c'], ['#', 'a', 'b', 'c', 'd'])).to.be.a('number').that.eql(-1);
        });
 
        it(`With two identical arrays - using the "fromIndex" parameter`, function() {
            expect(Arr._indexOfSet(['a', 'b', 'c'], ['a', 'b', 'c'], 0)).to.be.a('number').that.eql(0);
        });

        it(`With two left-and-right-identical arrays of longer operand A - using the "fromIndex" parameter`, function() {
            expect(Arr._indexOfSet(['a', 'b', 'c', '|', 'a', 'b', 'c'], ['a', 'b', 'c'], 1)).to.be.a('number').that.eql(4);
        });

    });

    describe(`lastIndexOfSet()`, function() {
 
        it(`With two identical arrays`, function() {
            expect(Arr._lastIndexOfSet(['a', 'b', 'c'], ['a', 'b', 'c'])).to.be.a('number').that.eql(0);
        });

        it(`With two left-and-right-identical arrays of longer operand A`, function() {
           expect(Arr._lastIndexOfSet(['a', 'b', 'c', '|', 'a', 'b', 'c'], ['a', 'b', 'c'])).to.be.a('number').that.eql(4);
        });
 
        it(`With two left-identical arrays of longer operand B`, function() {
            expect(Arr._lastIndexOfSet(['#', 'a', 'b', 'c'], ['#', 'a', 'b', 'c', 'd'])).to.be.a('number').that.eql(-1);
        });
 
        it(`With two identical arrays - using the "fromIndex" parameter`, function() {
            expect(Arr._lastIndexOfSet(['a', 'b', 'c'], ['a', 'b', 'c'], 0)).to.be.a('number').that.eql(-1);
        });

        it(`With two left-and-right-identical arrays of longer operand A - using the "fromIndex" parameter`, function() {
            expect(Arr._lastIndexOfSet(['a', 'b', 'c', '|', 'd', 'e', 'f'], ['a', 'b', 'c'], 5)).to.be.a('number').that.eql(0);
        });

    });

    describe(`startsWith()`, function() {
 
        it(`With two identical arrays`, function() {
            expect(Arr._startsWith(['a', 'b', 'c'], ['a', 'b', 'c'])).to.be.true;
        });

        it(`With two left-identical arrays of longer operand A`, function() {
           expect(Arr._startsWith(['a', 'b', 'c', 'd'], ['a', 'b', 'c'])).to.be.true;
        });

        it(`With two left-identical arrays of longer operand B`, function() {
            expect(Arr._startsWith(['a', 'b', 'c'], ['a', 'b', 'c', 'd'])).to.be.false;
        });
 
        it(`With two identical arrays - using the "dotSafe" parameter`, function() {
            expect(Arr._startsWith(['a', 'b', 'c'], ['a', 'b', 'c'], true)).to.be.true;
        });

        it(`With two left-identical arrays of longer operand A - using the "dotSafe" parameter`, function() {
           expect(Arr._startsWith(['a', 'b', 'c', 'd'], ['a', 'b', 'c'], true)).to.be.true;
        });

        it(`With two left-identical arrays of longer operand B - using the "dotSafe" parameter`, function() {
            expect(Arr._startsWith(['a', 'b', 'c'], ['a', 'b', 'c', 'd'], true)).to.be.false;
        });

    });

 });
 