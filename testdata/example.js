var globalExpect = global.expect;
function isPromise(obj) {
    return obj && typeof obj.then === 'function';
}
describe('example', function () {
    var expect = globalExpect.clone();
    expect.output.preferredWidth = 80;
    it('example #1 (testdata/example.md:4:1) should succeed', function () {
        var __returnValue1;
        example1:
            try {
                var Timelock = function Timelock(value, delay) {
                    this.value = value;
                    this.delay = delay;
                };
                Timelock.prototype.getValue = function (cb) {
                    var that = this;
                    setTimeout(function () {
                        cb(that.value);
                    }, this.delay);
                };
            } catch (err) {
                return endOfExample1(err);
            }
        if (isPromise(__returnValue1)) {
            return __returnValue1.then(function () {
                return endOfExample1();
            }, endOfExample1);
        } else {
            return endOfExample1();
        }
        function endOfExample1(err) {
            if (err) {
                expect.fail(err);
            }
        }
    });
    it('example #2 (testdata/example.md:18:1) should succeed', function () {
        var __returnValue1;
        example1:
            try {
                var Timelock = function Timelock(value, delay) {
                    this.value = value;
                    this.delay = delay;
                };
                Timelock.prototype.getValue = function (cb) {
                    var that = this;
                    setTimeout(function () {
                        cb(that.value);
                    }, this.delay);
                };
            } catch (err) {
                return endOfExample1(err);
            }
        if (isPromise(__returnValue1)) {
            return __returnValue1.then(function () {
                return endOfExample1();
            }, endOfExample1);
        } else {
            return endOfExample1();
        }
        function endOfExample1(err) {
            var __returnValue2;
            example2:
                try {
                    expect.addType({
                        name: 'Timelock',
                        identify: function (value) {
                            return value && value instanceof Timelock;
                        },
                        inspect: function (value, depth, output) {
                            output.jsFunctionName('Timelock');
                        }
                    });
                    expect.addAssertion('<Timelock> to satisfy <any>', function (expect, subject, spec) {
                        return expect.promise(function (run) {
                            subject.getValue(run(function (value) {
                                return expect(value, 'to satisfy', spec);
                            }));
                        });
                    });
                } catch (err) {
                    return endOfExample2(err);
                }
            if (isPromise(__returnValue2)) {
                return __returnValue2.then(function () {
                    return endOfExample2();
                }, endOfExample2);
            } else {
                return endOfExample2();
            }
            function endOfExample2(err) {
                if (err) {
                    expect.fail(err);
                }
            }
        }
    });
    it('example #3 (testdata/example.md:46:1) should fail with the correct error message', function () {
        var __returnValue1;
        example1:
            try {
                var Timelock = function Timelock(value, delay) {
                    this.value = value;
                    this.delay = delay;
                };
                Timelock.prototype.getValue = function (cb) {
                    var that = this;
                    setTimeout(function () {
                        cb(that.value);
                    }, this.delay);
                };
            } catch (err) {
                return endOfExample1(err);
            }
        if (isPromise(__returnValue1)) {
            return __returnValue1.then(function () {
                return endOfExample1();
            }, endOfExample1);
        } else {
            return endOfExample1();
        }
        function endOfExample1(err) {
            var __returnValue2;
            example2:
                try {
                    __returnValue2 = expect(new Timelock('Hello world!', 5), 'to satisfy', expect.it('not to match', /!/));
                    break example2;
                } catch (err) {
                    return endOfExample2(err);
                }
            if (isPromise(__returnValue2)) {
                return __returnValue2.then(function () {
                    return endOfExample2();
                }, endOfExample2);
            } else {
                return endOfExample2();
            }
            function endOfExample2(err) {
                if (err) {
                    var message = err.isUnexpected ? err.getErrorMessage('text').toString() : err.message;
                    expect(message, 'to equal', 'expected Timelock to satisfy expect.it(\'not to match\', /!/)\n\nexpected \'Hello world!\' not to match /!/\n\nHello world!\n           ^');
                } else {
                    throw new Error('expected example to fail');
                }
            }
        }
    });
});