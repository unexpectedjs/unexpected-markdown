/*global describe, it, setImmediate*/
var extractTopLevelVariables = require('../lib/extractTopLevelVariables');
var esprima = require('esprima');
var escodegen = require('escodegen');

function codeToString(astOrStringOrFunction) {
    var ast;
    if (typeof astOrStringOrFunction === 'object') {
        ast = astOrStringOrFunction;
    } else {
        if (typeof astOrStringOrFunction === 'function') {
            astOrStringOrFunction = '(' + astOrStringOrFunction.toString() + '());';
        } else if (typeof astOrStringOrFunction === 'string') {
            // assume string
            astOrStringOrFunction = '(function () {' + astOrStringOrFunction + '}());';
        }
        ast = esprima.parse(astOrStringOrFunction).body[0].expression.callee.body;
    }
    return escodegen.generate(ast);
}

var expect = require('unexpected').clone()
    .use(require('magicpen-prism'))
    .addAssertion('to come out as', function (expect, subject, value) {
        expect(codeToString(extractTopLevelVariables(subject)), 'to equal', codeToString(value));
    });

describe('extractTopLevelVariables', function () {
    it('should output an empty iife when processing an empty program', function () {
        expect(function () {
            /* eslint-disable */
            /* eslint-enable */
        }, 'to come out as', function () {
            /* eslint-disable */
            (function () {}());
            /* eslint-enable */
        });
    });

    it('should hoist vars in a moderately complex example', function () {
        expect(function () {
            /* eslint-disable */
            let a = 123;
            if (fullMoon()) {
                var c = 987;
                let d = 666;
            }
            (function () {
                var b = 456;
            }());
            return new Promise(function (resolve, reject){
                resolve();
            });
            /* eslint-enable */
        }, 'to come out as', function () {
            /* eslint-disable */
            var a;
            var c;
            (function () {
                a = 123;
                if (fullMoon()) {
                    c = 987;
                    let d = 666;
                }
                (function () {
                    var b = 456;
                }());
                return new Promise(function (resolve, reject){
                    resolve();
                });
                /* eslint-enable */
            }());
        });
    });

    it('should hoist from a destructured object', function () {
        expect(function () {
            /* eslint-disable */
            var {a, b} = {};
            /* eslint-enable */
        }, 'to come out as', function () {
            /* eslint-disable */
            var a;
            var b;
            (function () {
                ({a, b} = {});
            }());
            /* eslint-enable */
        });
    });

    it('should not hoist identifiers found in default values when destructuring an object', function () {
        expect(function () {
            /* eslint-disable */
            var {a = b} = {};
            /* eslint-enable */
        }, 'to come out as', function () {
            /* eslint-disable */
            var a;
            (function () {
                ({a = b} = {});
            }());
            /* eslint-enable */
        });
    });

    it('should hoist from a destructured array', function () {
        expect(function () {
            /* eslint-disable */
            let [a, {b, c}, ...d] = theThing;
            /* eslint-enable */
        }, 'to come out as', function () {
            /* eslint-disable */
            var a;
            var b;
            var c;
            var d;
            (function () {
                [a, {b, c}, ...d] = theThing;
            }());
            /* eslint-enable */
        });
    });
});
