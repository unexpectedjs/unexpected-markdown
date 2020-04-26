var globalExpect = global.expect;
function isPromise(obj) {
  return obj && typeof obj.then === 'function';
}
describe.only('addAssertion', function () {
  var expect = globalExpect.clone();
  expect.output.preferredWidth = 80;
  it('example #1 (documentation/api/addAssertion.md:21:1) should succeed', function () {
    var __returnValue1;
    example1: try {
      expect.addAssertion('<array> to have item <any>', function (
        expect,
        subject,
        value
      ) {
        expect(subject, 'to contain', value);
      });
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
  it('example #2 (documentation/api/addAssertion.md:36:1) should succeed', function () {
    var __returnValue1;
    example1: try {
      expect([1, 2, 3], 'to have item', 2);
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
  it('example #3 (documentation/api/addAssertion.md:54:1) should fail with the correct error message', function () {
    var __returnValue1;
    example1: try {
      expect('abcd', 'to have item', 'a');
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
        var message = err.isUnexpected
          ? err.getErrorMessage('text').toString()
          : err.message;
        expect(
          message,
          'to equal',
          "expected 'abcd' to have item 'a'\n  The assertion does not have a matching signature for:\n    <string> to have item <string>\n  did you mean:\n    <array> to have item <any>"
        );
      } else {
        throw new Error('expected example to fail');
      }
    }
  });
  it('example #4 (documentation/api/addAssertion.md:72:1) should succeed', function () {
    var __returnValue1;
    example1: try {
      expect.addAssertion('<number> to be between <number> <number>', function (
        expect,
        subject,
        value1,
        value2
      ) {
        expect(subject, 'to be greater than', value1).and(
          'to be less than',
          value2
        );
      });
      expect(2, 'to be between', 1, 3);
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
  it('example #5 (documentation/api/addAssertion.md:94:1) should fail with the correct error message', function () {
    expect = globalExpect.clone();
    var __returnValue1;
    example1: try {
      expect.addAssertion('<array> to have item <number|string>', function (
        expect,
        subject,
        value
      ) {
        expect(subject, 'to contain', value);
      });
      expect([1, 2, 3], 'to have item', 2);
      expect(['a', 'b', 'c'], 'to have item', 'a');
      expect([true, false], 'to have item', true);
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
        var message = err.isUnexpected
          ? err.getErrorMessage('text').toString()
          : err.message;
        expect(
          message,
          'to equal',
          'expected [ true, false ] to have item true\n  The assertion does not have a matching signature for:\n    <array> to have item <boolean>\n  did you mean:\n    <array> to have item <number|string>'
        );
      } else {
        throw new Error('expected example to fail');
      }
    }
  });
  it('example #6 (documentation/api/addAssertion.md:123:1) should succeed', function () {
    expect = globalExpect.clone();
    var __returnValue1;
    example1: try {
      expect.addAssertion(
        ['<array> to have item <any>', '<array> to have value <any>'],
        function (expect, subject, value) {
          expect(subject, 'to contain', value);
        }
      );
      expect([1, 2, 3], 'to have item', 2);
      expect([1, 2, 3], 'to have value', 3);
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
  it('example #7 (documentation/api/addAssertion.md:140:1) should succeed', function () {
    expect = globalExpect.clone();
    var __returnValue1;
    example1: try {
      expect.addAssertion('<array> to have (item|value) <any>', function (
        expect,
        subject,
        value
      ) {
        expect(subject, 'to contain', value);
      });
      expect([1, 2, 3], 'to have item', 2);
      expect([1, 2, 3], 'to have value', 3);
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
  it('example #8 (documentation/api/addAssertion.md:159:1) should succeed', function () {
    expect = globalExpect.clone();
    var __returnValue1;
    example1: try {
      expect.addAssertion('<array> to have (index|value) <any>', function (
        expect,
        subject,
        value
      ) {
        if (expect.alternations[0] === 'index') {
          expect(subject[value], 'to be defined');
        } else {
          expect(subject, 'to contain', value);
        }
      });
      expect(['a', 'b'], 'to have index', 1);
      expect(['a', 'b'], 'to have value', 'b');
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
  it('example #9 (documentation/api/addAssertion.md:184:1) should succeed', function () {
    expect = globalExpect.clone();
    var __returnValue1;
    example1: try {
      expect.addAssertion('<array> [not] to have item <any>', function (
        expect,
        subject,
        value
      ) {
        if (expect.flags.not) {
          expect(subject, 'not to contain', value);
        } else {
          expect(subject, 'to contain', value);
        }
      });
      expect([1, 2, 3], 'to have item', 2);
      expect([1, 2, 3], 'not to have item', 4);
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
  it('example #10 (documentation/api/addAssertion.md:211:1) should succeed', function () {
    expect = globalExpect.clone();
    var __returnValue1;
    example1: try {
      expect.addAssertion('<array> [not] to have item <any>', function (
        expect,
        subject,
        value
      ) {
        expect(subject, '[not] to contain', value);
      });
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
  it('example #11 (documentation/api/addAssertion.md:230:1) should succeed', function () {
    expect = globalExpect.clone();
    var __returnValue1;
    example1: try {
      expect.addAssertion('<array> [not] to have item <any>', function (
        expect,
        subject,
        value
      ) {
        expect(subject, '[!not] to contain', value);
      });
      expect([1, 2, 3], 'not to have item', 2);
      expect([1, 2, 3], 'to have item', 4);
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
  it('example #12 (documentation/api/addAssertion.md:248:1) should succeed', function () {
    expect = globalExpect.clone();
    var __returnValue1;
    example1: try {
      expect.addAssertion('<array> to have [this] item <any>', function (
        expect,
        subject,
        value
      ) {
        expect(subject, 'to contain', value);
      });
      expect([1, 2, 3], 'to have item', 2);
      expect([1, 2, 3], 'to have this item', 2);
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
  it('example #13 (documentation/api/addAssertion.md:269:1) should succeed', function () {
    var __returnValue1;
    example1: try {
      var errorMode = 'default';
      expect.addAssertion(
        '<array> [not] to be (sorted|ordered) [by] <function?>',
        function (expect, subject, cmp) {
          expect.errorMode = errorMode;
          expect(subject, '[not] to equal', [].concat(subject).sort(cmp));
        }
      );
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
  it('example #14 (documentation/api/addAssertion.md:282:1) should succeed', function () {
    var __returnValue1;
    example1: try {
      var errorMode = 'default';
      expect.addAssertion(
        '<array> [not] to be (sorted|ordered) [by] <function?>',
        function (expect, subject, cmp) {
          expect.errorMode = errorMode;
          expect(subject, '[not] to equal', [].concat(subject).sort(cmp));
        }
      );
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
      example2: try {
        expect([1, 2, 3], 'to be sorted');
        expect([1, 2, 3], 'to be ordered');
        expect([2, 1, 3], 'not to be sorted');
        expect([2, 1, 3], 'not to be ordered');
        expect([3, 2, 1], 'to be sorted', function (x, y) {
          return y - x;
        });
        expect([3, 2, 1], 'to be sorted by', function (x, y) {
          return y - x;
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
  it('example #15 (documentation/api/addAssertion.md:310:1) should fail with the correct error message', function () {
    var __returnValue1;
    example1: try {
      var errorMode = 'default';
      expect.addAssertion(
        '<array> [not] to be (sorted|ordered) [by] <function?>',
        function (expect, subject, cmp) {
          expect.errorMode = errorMode;
          expect(subject, '[not] to equal', [].concat(subject).sort(cmp));
        }
      );
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
      example2: try {
        expect.addAssertion(
          '<number> to be contained by <number> <number>',
          function (expect, subject, start, finish) {
            expect.subjectOutput = function (output) {
              output.text('point ').jsNumber(subject);
            };
            expect.argsOutput = function (output) {
              output
                .text('interval ')
                .text('[')
                .appendInspected(start)
                .text(';')
                .appendInspected(finish)
                .text(']');
            };
            expect(subject >= start && subject <= finish, '[not] to be truthy');
          }
        );
        expect(4, 'to be contained by', 8, 10);
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
          var message = err.isUnexpected
            ? err.getErrorMessage('text').toString()
            : err.message;
          expect(
            message,
            'to equal',
            'expected point 4 to be contained by interval [8;10]'
          );
        } else {
          throw new Error('expected example to fail');
        }
      }
    }
  });
  it('example #16 (documentation/api/addAssertion.md:339:1) should fail with the correct error message', function () {
    var __returnValue1;
    example1: try {
      var errorMode = 'default';
      expect.addAssertion(
        '<array> [not] to be (sorted|ordered) [by] <function?>',
        function (expect, subject, cmp) {
          expect.errorMode = errorMode;
          expect(subject, '[not] to equal', [].concat(subject).sort(cmp));
        }
      );
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
      example2: try {
        expect.addAssertion(
          '<number> to be similar to <number> <number?>',
          function (expect, subject, value, epsilon) {
            if (typeof epsilon !== 'number') {
              epsilon = 1e-9;
            }
            expect.argsOutput[2] = function (output) {
              output
                .text('(epsilon: ')
                .jsNumber(epsilon.toExponential())
                .text(')');
            };
            expect(
              Math.abs(subject - value),
              'to be less than or equal to',
              epsilon
            );
          }
        );
        expect(4, 'to be similar to', 4.0001);
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
          var message = err.isUnexpected
            ? err.getErrorMessage('text').toString()
            : err.message;
          expect(
            message,
            'to equal',
            'expected 4 to be similar to 4.0001, (epsilon: 1e-9)'
          );
        } else {
          throw new Error('expected example to fail');
        }
      }
    }
  });
  it('example #17 (documentation/api/addAssertion.md:368:1) should fail with the correct error message', function () {
    var __returnValue1;
    example1: try {
      var errorMode = 'default';
      expect.addAssertion(
        '<array> [not] to be (sorted|ordered) [by] <function?>',
        function (expect, subject, cmp) {
          expect.errorMode = errorMode;
          expect(subject, '[not] to equal', [].concat(subject).sort(cmp));
        }
      );
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
      example2: try {
        expect([1, 3, 2, 4], 'to be sorted');
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
          var message = err.isUnexpected
            ? err.getErrorMessage('text').toString()
            : err.message;
          expect(
            message,
            'to equal',
            'expected [ 1, 3, 2, 4 ] to be sorted\n\n[\n    1,\n\u250C\u2500\u25B7\n\u2502   3,\n\u2514\u2500\u2500 2, // should be moved\n    4\n]'
          );
        } else {
          throw new Error('expected example to fail');
        }
      }
    }
  });
  it('example #18 (documentation/api/addAssertion.md:391:1) should fail with the correct error message', function () {
    var __returnValue1;
    example1: try {
      var errorMode = 'default';
      expect.addAssertion(
        '<array> [not] to be (sorted|ordered) [by] <function?>',
        function (expect, subject, cmp) {
          expect.errorMode = errorMode;
          expect(subject, '[not] to equal', [].concat(subject).sort(cmp));
        }
      );
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
      example2: try {
        errorMode = 'bubble';
        expect([1, 3, 2, 4], 'to be sorted');
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
          var message = err.isUnexpected
            ? err.getErrorMessage('text').toString()
            : err.message;
          expect(
            message,
            'to equal',
            'expected [ 1, 3, 2, 4 ] to equal [ 1, 2, 3, 4 ]\n\n[\n    1,\n\u250C\u2500\u25B7\n\u2502   3,\n\u2514\u2500\u2500 2, // should be moved\n    4\n]'
          );
        } else {
          throw new Error('expected example to fail');
        }
      }
    }
  });
  it('example #19 (documentation/api/addAssertion.md:413:1) should fail with the correct error message', function () {
    var __returnValue1;
    example1: try {
      var errorMode = 'default';
      expect.addAssertion(
        '<array> [not] to be (sorted|ordered) [by] <function?>',
        function (expect, subject, cmp) {
          expect.errorMode = errorMode;
          expect(subject, '[not] to equal', [].concat(subject).sort(cmp));
        }
      );
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
      example2: try {
        errorMode = 'nested';
        expect([1, 3, 2, 4], 'to be sorted');
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
          var message = err.isUnexpected
            ? err.getErrorMessage('text').toString()
            : err.message;
          expect(
            message,
            'to equal',
            'expected [ 1, 3, 2, 4 ] to be sorted\n  expected [ 1, 3, 2, 4 ] to equal [ 1, 2, 3, 4 ]\n\n  [\n      1,\n  \u250C\u2500\u25B7\n  \u2502   3,\n  \u2514\u2500\u2500 2, // should be moved\n      4\n  ]'
          );
        } else {
          throw new Error('expected example to fail');
        }
      }
    }
  });
  it('example #20 (documentation/api/addAssertion.md:436:1) should fail with the correct error message', function () {
    var __returnValue1;
    example1: try {
      var errorMode = 'default';
      expect.addAssertion(
        '<array> [not] to be (sorted|ordered) [by] <function?>',
        function (expect, subject, cmp) {
          expect.errorMode = errorMode;
          expect(subject, '[not] to equal', [].concat(subject).sort(cmp));
        }
      );
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
      example2: try {
        errorMode = 'defaultOrNested';
        expect([1, 3, 2, 4], 'to be sorted');
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
          var message = err.isUnexpected
            ? err.getErrorMessage('text').toString()
            : err.message;
          expect(
            message,
            'to equal',
            'expected [ 1, 3, 2, 4 ] to be sorted\n\n[\n    1,\n\u250C\u2500\u25B7\n\u2502   3,\n\u2514\u2500\u2500 2, // should be moved\n    4\n]'
          );
        } else {
          throw new Error('expected example to fail');
        }
      }
    }
  });
  it('example #21 (documentation/api/addAssertion.md:458:1) should fail with the correct error message', function () {
    var __returnValue1;
    example1: try {
      var errorMode = 'default';
      expect.addAssertion(
        '<array> [not] to be (sorted|ordered) [by] <function?>',
        function (expect, subject, cmp) {
          expect.errorMode = errorMode;
          expect(subject, '[not] to equal', [].concat(subject).sort(cmp));
        }
      );
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
      example2: try {
        errorMode = 'diff';
        expect([1, 3, 2, 4], 'to be sorted');
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
          var message = err.isUnexpected
            ? err.getErrorMessage('text').toString()
            : err.message;
          expect(
            message,
            'to equal',
            '[\n    1,\n\u250C\u2500\u25B7\n\u2502   3,\n\u2514\u2500\u2500 2, // should be moved\n    4\n]'
          );
        } else {
          throw new Error('expected example to fail');
        }
      }
    }
  });
  it('example #22 (documentation/api/addAssertion.md:484:1) should succeed', function () {
    var __returnValue1;
    example1: try {
      var errorMode = 'default';
      expect.addAssertion(
        '<array> [not] to be (sorted|ordered) [by] <function?>',
        function (expect, subject, cmp) {
          expect.errorMode = errorMode;
          expect(subject, '[not] to equal', [].concat(subject).sort(cmp));
        }
      );
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
      example2: try {
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
  it.skip('example #23 (documentation/api/addAssertion.md:517:1) should succeed', function () {
    var __returnValue1;
    example1: try {
      var errorMode = 'default';
      expect.addAssertion(
        '<array> [not] to be (sorted|ordered) [by] <function?>',
        function (expect, subject, cmp) {
          expect.errorMode = errorMode;
          expect(subject, '[not] to equal', [].concat(subject).sort(cmp));
        }
      );
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
      example2: try {
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
        var __returnValue3;
        example3: try {
          expect.addType({
            name: 'Timelock',
            identify: function (value) {
              return value && value instanceof Timelock;
            },
            inspect: function (value, depth, output) {
              output.jsFunctionName('Timelock');
            },
          });
          expect.addAssertion('<Timelock> to satisfy <any>', function (
            expect,
            subject,
            spec
          ) {
            return expect.promise(function (run) {
              subject.getValue(
                run(function (value) {
                  return expect(value, 'to satisfy', spec);
                })
              );
            });
          });
        } catch (err) {
          return endOfExample3(err);
        }
        if (isPromise(__returnValue3)) {
          return __returnValue3.then(function () {
            return endOfExample3();
          }, endOfExample3);
        } else {
          return endOfExample3();
        }
        function endOfExample3(err) {
          if (err) {
            expect.fail(err);
          }
        }
      }
    }
  });
  it('example #24 (documentation/api/addAssertion.md:547:1) should fail with the correct error message', function () {
    var __returnValue1;
    example1: try {
      var errorMode = 'default';
      expect.addAssertion(
        '<array> [not] to be (sorted|ordered) [by] <function?>',
        function (expect, subject, cmp) {
          expect.errorMode = errorMode;
          expect(subject, '[not] to equal', [].concat(subject).sort(cmp));
        }
      );
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
      example2: try {
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
        var __returnValue3;
        example3: try {
          expect.addType({
            name: 'Timelock',
            identify: function (value) {
              return value && value instanceof Timelock;
            },
            inspect: function (value, depth, output) {
              output.jsFunctionName('Timelock');
            },
          });
          expect.addAssertion('<Timelock> to satisfy <any>', function (
            expect,
            subject,
            spec
          ) {
            return expect.promise(function (run) {
              subject.getValue(
                run(function (value) {
                  return expect(value, 'to satisfy', spec);
                })
              );
            });
          });
        } catch (err) {
          return endOfExample3(err);
        }
        if (isPromise(__returnValue3)) {
          return __returnValue3.then(function () {
            return endOfExample3();
          }, endOfExample3);
        } else {
          return endOfExample3();
        }
        function endOfExample3(err) {
          var __returnValue4;
          example4: try {
            __returnValue4 = expect(
              new Timelock('Hello world!', 5),
              'to satisfy',
              expect.it('not to match', /!/)
            );
            break example4;
          } catch (err) {
            return endOfExample4(err);
          }
          if (isPromise(__returnValue4)) {
            return __returnValue4.then(function () {
              return endOfExample4();
            }, endOfExample4);
          } else {
            return endOfExample4();
          }
          function endOfExample4(err) {
            if (err) {
              var message = err.isUnexpected
                ? err.getErrorMessage('text').toString()
                : err.message;
              expect(
                message,
                'to equal',
                "expected Timelock to satisfy expect.it('not to match', /!/)\n\nexpected 'Hello world!' not to match /!/\n\nHello world!\n           ^"
              );
            } else {
              throw new Error('expected example to fail');
            }
          }
        }
      }
    }
  });
});
