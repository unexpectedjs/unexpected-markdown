/* eslint-disable mocha/no-nested-tests, mocha/no-identical-title */
var Module = require('module');
var path = require('path');
var vm = require('vm');

var convertMarkdownToMocha = require('../lib/convertMarkdownToMocha');
var esprima = require('esprima');
var escodegen = require('escodegen');

var projectPath = require('path').resolve(__dirname, '..');

function codeToString(obj) {
  var ast;
  if (typeof obj === 'function') {
    obj = `(${obj.toString()}());`;
  } else {
    obj = `(function () {${obj}}());`;
  }
  ast = esprima.parse(obj).body[0].expression.callee.body;
  return escodegen.generate(ast);
}

function createRequire(filepath) {
  const filename = path.join(filepath, 'noop.js');
  // eslint-disable-next-line n/no-deprecated-api
  return (Module.createRequire || Module.createRequireFromPath)(filename);
}

function createTestRunnerEnvironment(code) {
  const blocks = []; // collect blocks registered with before and it

  const context = {
    executeTestBlocks: async function () {
      // execute the collected blocks in order
      for (const block of blocks) {
        await block();
      }
    },
    expect: require('unexpected'),
    describe: (_, fn) => fn(),
    before: (block) => blocks.push(block),
    it: (_, block) => blocks.push(block),
    require: createRequire(path.resolve(__dirname, '..')),
  };
  context.global = context;

  return {
    get code() {
      return `${code}\nexecuteTestBlocks()`;
    },
    get context() {
      return context;
    },
  };
}

var expect = require('unexpected')
  .clone()
  .use(require('magicpen-prism'))
  .addAssertion(
    '<string> to come out as <function|string>',
    function (expect, subject, value) {
      expect(
        codeToString(convertMarkdownToMocha(subject).code).replace(
          / {4}var fileName = '<inline code>'[\s\S]*$/,
          '}'
        ),
        'to equal',
        codeToString(value).replace(/<projectPath>/g, projectPath)
      );
    }
  );

var synchronousSuccessfulSnippet =
  "var foo = 'abc';\n" + "expect(foo, 'to equal', 'abc');\n";

var returningSuccessfulSnippet =
  "var blah = 'abc';\n" +
  "if (blah === 'abc') {\n" +
  '  return expect.promise(function (resolve, reject) {\n' +
  '    setImmediate(resolve);\n' +
  '  });\n' +
  '} else {\n' +
  '  return 456;\n' +
  '}\n';

var synchronousThrowingSnippet =
  "var bar = 'abc';\n" + "expect(bar, 'to equal', 'def');\n";

function fences(code, language) {
  return `\`\`\`${language || 'js'}\n${code}\n\`\`\`\n`;
}

describe('convertMarkdownToMocha', function () {
  it('should convert a returning snippet expected to be successful', function () {
    expect(fences(returningSuccessfulSnippet), 'to come out as', function () {
      var { Markdown } = require('./node_modules/evaldown/lib/Evaldown.js');
      var globalExpect = global.expect;

      describe('<inline code>', function () {
        var expect = globalExpect.clone();
        expect.output.preferredWidth = 80;
        before(async function () {
          var md = await new Markdown(
            "```js\nvar blah = 'abc';\nif (blah === 'abc') {\n  return expect.promise(function (resolve, reject) {\n    setImmediate(resolve);\n  });\n} else {\n  return 456;\n}\n\n```\n",
            {
              marker: 'unexpected-markdown',
              capture: 'return',
              pwdPath: '<projectPath>',
              fileGlobals: { expect: () => expect.clone() },
            }
          );
          await md.evaluate();
          this.evaluatedSnippets = md.getSnippets();
          this.isNextEvaluatedSnippetOutput = (index) => {
            var nextSnippet = this.evaluatedSnippets.get(index + 1);
            return !!nextSnippet && nextSnippet.lang === 'output';
          };
        });
        it('example #1 (<inline code>:2:1) should succeed', function () {
          var snippetIndex = 0;
          var currentSnippet = this.evaluatedSnippets.get(snippetIndex);
          var evaluatedSnippet = this.evaluatedSnippets.get(
            currentSnippet.lang === 'output' ? snippetIndex - 1 : snippetIndex
          );
          var { output } = evaluatedSnippet;
          if (output === null) {
            throw new Error('snippet was not correctly evaluted');
          }
          if (
            output.kind === 'error' &&
            !this.isNextEvaluatedSnippetOutput(snippetIndex)
          ) {
            expect.fail(`snippet evaluation caused an error\n\n${output.text}`);
          }
        });
      });
    });
  });

  it('should convert a returning snippet expected to fail', function () {
    expect(
      `${fences(returningSuccessfulSnippet)}\n${fences(
        'theErrorMessage',
        'output'
      )}`,
      'to come out as',
      function () {
        var { Markdown } = require('./node_modules/evaldown/lib/Evaldown.js');
        var globalExpect = global.expect;

        describe('<inline code>', function () {
          var expect = globalExpect.clone();
          expect.output.preferredWidth = 80;

          before(async function () {
            var md = await new Markdown(
              "```js\nvar blah = 'abc';\nif (blah === 'abc') {\n  return expect.promise(function (resolve, reject) {\n    setImmediate(resolve);\n  });\n} else {\n  return 456;\n}\n\n```\n\n```output\ntheErrorMessage\n```\n",
              {
                marker: 'unexpected-markdown',
                capture: 'return',
                pwdPath: '<projectPath>',
                fileGlobals: { expect: () => expect.clone() },
              }
            );
            await md.evaluate();
            this.evaluatedSnippets = md.getSnippets();
            this.isNextEvaluatedSnippetOutput = (index) => {
              var nextSnippet = this.evaluatedSnippets.get(index + 1);
              return !!nextSnippet && nextSnippet.lang === 'output';
            };
          });
          it('example #1 (<inline code>:2:1) should succeed', function () {
            var snippetIndex = 0;
            var currentSnippet = this.evaluatedSnippets.get(snippetIndex);
            var evaluatedSnippet = this.evaluatedSnippets.get(
              currentSnippet.lang === 'output' ? snippetIndex - 1 : snippetIndex
            );
            var { output } = evaluatedSnippet;
            if (output === null) {
              throw new Error('snippet was not correctly evaluted');
            }
            if (
              output.kind === 'error' &&
              !this.isNextEvaluatedSnippetOutput(snippetIndex)
            ) {
              expect.fail(
                `snippet evaluation caused an error\n\n${output.text}`
              );
            }
          });

          it('example #2 (<inline code>:14:1) should succeed with the correct output', function () {
            var snippetIndex = 1;
            var currentSnippet = this.evaluatedSnippets.get(snippetIndex);
            var evaluatedSnippet = this.evaluatedSnippets.get(
              currentSnippet.lang === 'output' ? snippetIndex - 1 : snippetIndex
            );
            var writtenOutput = 'theErrorMessage';
            expect(evaluatedSnippet.output.text, 'to equal', writtenOutput);
          });
        });
      }
    );
  });

  it('should convert a snippet where the output block has cleanStackTrace:true', function () {
    if (process.env.NODE_ENV === 'coverage') return this.skip();

    expect(
      `${fences(
        returningSuccessfulSnippet
      )}\n<!-- unexpected-markdown cleanStackTrace:true -->\n${fences(
        'theErrorMessage',
        'output'
      )}`,
      'to come out as',
      function () {
        var { Markdown } = require('./node_modules/evaldown/lib/Evaldown.js');
        var globalExpect = global.expect;

        describe('<inline code>', function () {
          var expect = globalExpect.clone();
          expect.output.preferredWidth = 80;

          before(async function () {
            var md = await new Markdown(
              "```js\nvar blah = 'abc';\nif (blah === 'abc') {\n  return expect.promise(function (resolve, reject) {\n    setImmediate(resolve);\n  });\n} else {\n  return 456;\n}\n\n```\n\n<!-- unexpected-markdown cleanStackTrace:true -->\n```output\ntheErrorMessage\n```\n",
              {
                marker: 'unexpected-markdown',
                capture: 'return',
                pwdPath: '<projectPath>',
                fileGlobals: { expect: () => expect.clone() },
              }
            );
            await md.evaluate();
            this.evaluatedSnippets = md.getSnippets();
            this.isNextEvaluatedSnippetOutput = (index) => {
              var nextSnippet = this.evaluatedSnippets.get(index + 1);
              return !!nextSnippet && nextSnippet.lang === 'output';
            };
          });

          it('example #1 (<inline code>:2:1) should succeed', function () {
            var snippetIndex = 0;
            var currentSnippet = this.evaluatedSnippets.get(snippetIndex);
            var evaluatedSnippet = this.evaluatedSnippets.get(
              currentSnippet.lang === 'output' ? snippetIndex - 1 : snippetIndex
            );
            var { output } = evaluatedSnippet;
            if (output === null) {
              throw new Error('snippet was not correctly evaluted');
            }
            if (
              output.kind === 'error' &&
              !this.isNextEvaluatedSnippetOutput(snippetIndex)
            ) {
              expect.fail(
                `snippet evaluation caused an error\n\n${output.text}`
              );
            }
          });

          it('example #2 (<inline code>:14:1) should succeed with the correct output', function () {
            var snippetIndex = 1;
            var currentSnippet = this.evaluatedSnippets.get(snippetIndex);
            var evaluatedSnippet = this.evaluatedSnippets.get(
              currentSnippet.lang === 'output' ? snippetIndex - 1 : snippetIndex
            );
            var writtenOutput = 'theErrorMessage';
            expect(evaluatedSnippet.output.text, 'to equal', writtenOutput);
          });
        });
      }
    );
  });

  it('should convert a returning snippet expected to fail followed by another one', function () {
    expect(
      `${fences(returningSuccessfulSnippet)}\n${fences(
        'theErrorMessage',
        'output'
      )}\n${fences(synchronousSuccessfulSnippet)}`,
      'to come out as',
      function () {
        var { Markdown } = require('./node_modules/evaldown/lib/Evaldown.js');
        var globalExpect = global.expect;

        describe('<inline code>', function () {
          var expect = globalExpect.clone();
          expect.output.preferredWidth = 80;

          before(async function () {
            var md = await new Markdown(
              "```js\nvar blah = 'abc';\nif (blah === 'abc') {\n  return expect.promise(function (resolve, reject) {\n    setImmediate(resolve);\n  });\n} else {\n  return 456;\n}\n\n```\n\n```output\ntheErrorMessage\n```\n\n```js\nvar foo = 'abc';\nexpect(foo, 'to equal', 'abc');\n\n```\n",
              {
                marker: 'unexpected-markdown',
                capture: 'return',
                pwdPath: '<projectPath>',
                fileGlobals: { expect: () => expect.clone() },
              }
            );
            await md.evaluate();
            this.evaluatedSnippets = md.getSnippets();
            this.isNextEvaluatedSnippetOutput = (index) => {
              var nextSnippet = this.evaluatedSnippets.get(index + 1);
              return !!nextSnippet && nextSnippet.lang === 'output';
            };
          });

          it('example #1 (<inline code>:2:1) should succeed', function () {
            var snippetIndex = 0;
            var currentSnippet = this.evaluatedSnippets.get(snippetIndex);
            var evaluatedSnippet = this.evaluatedSnippets.get(
              currentSnippet.lang === 'output' ? snippetIndex - 1 : snippetIndex
            );
            var { output } = evaluatedSnippet;
            if (output === null) {
              throw new Error('snippet was not correctly evaluted');
            }
            if (
              output.kind === 'error' &&
              !this.isNextEvaluatedSnippetOutput(snippetIndex)
            ) {
              expect.fail(
                `snippet evaluation caused an error\n\n${output.text}`
              );
            }
          });

          it('example #2 (<inline code>:14:1) should succeed with the correct output', function () {
            var snippetIndex = 1;
            var currentSnippet = this.evaluatedSnippets.get(snippetIndex);
            var evaluatedSnippet = this.evaluatedSnippets.get(
              currentSnippet.lang === 'output' ? snippetIndex - 1 : snippetIndex
            );
            var writtenOutput = 'theErrorMessage';
            expect(evaluatedSnippet.output.text, 'to equal', writtenOutput);
          });

          it('example #3 (<inline code>:18:1) should succeed', function () {
            var snippetIndex = 2;
            var currentSnippet = this.evaluatedSnippets.get(snippetIndex);
            var evaluatedSnippet = this.evaluatedSnippets.get(
              currentSnippet.lang === 'output' ? snippetIndex - 1 : snippetIndex
            );
            var { output } = evaluatedSnippet;
            if (output === null) {
              throw new Error('snippet was not correctly evaluted');
            }
            if (
              output.kind === 'error' &&
              !this.isNextEvaluatedSnippetOutput(snippetIndex)
            ) {
              expect.fail(
                `snippet evaluation caused an error\n\n${output.text}`
              );
            }
          });
        });
      }
    );
  });

  it('should convert a synchronously succeeding snippet followed by another one', function () {
    expect(
      `${fences(synchronousSuccessfulSnippet)}\n${fences(
        synchronousThrowingSnippet
      )}`,
      'to come out as',
      function () {
        var { Markdown } = require('./node_modules/evaldown/lib/Evaldown.js');
        var globalExpect = global.expect;

        describe('<inline code>', function () {
          var expect = globalExpect.clone();
          expect.output.preferredWidth = 80;

          before(async function () {
            var md = await new Markdown(
              "```js\nvar foo = 'abc';\nexpect(foo, 'to equal', 'abc');\n\n```\n\n```js\nvar bar = 'abc';\nexpect(bar, 'to equal', 'def');\n\n```\n",
              {
                marker: 'unexpected-markdown',
                capture: 'return',
                pwdPath: '<projectPath>',
                fileGlobals: { expect: () => expect.clone() },
              }
            );
            await md.evaluate();
            this.evaluatedSnippets = md.getSnippets();
            this.isNextEvaluatedSnippetOutput = (index) => {
              var nextSnippet = this.evaluatedSnippets.get(index + 1);
              return !!nextSnippet && nextSnippet.lang === 'output';
            };
          });

          it('example #1 (<inline code>:2:1) should succeed', function () {
            var snippetIndex = 0;
            var currentSnippet = this.evaluatedSnippets.get(snippetIndex);
            var evaluatedSnippet = this.evaluatedSnippets.get(
              currentSnippet.lang === 'output' ? snippetIndex - 1 : snippetIndex
            );
            var { output } = evaluatedSnippet;
            if (output === null) {
              throw new Error('snippet was not correctly evaluted');
            }
            if (
              output.kind === 'error' &&
              !this.isNextEvaluatedSnippetOutput(snippetIndex)
            ) {
              expect.fail(
                `snippet evaluation caused an error\n\n${output.text}`
              );
            }
          });

          it('example #2 (<inline code>:8:1) should succeed', function () {
            var snippetIndex = 1;
            var currentSnippet = this.evaluatedSnippets.get(snippetIndex);
            var evaluatedSnippet = this.evaluatedSnippets.get(
              currentSnippet.lang === 'output' ? snippetIndex - 1 : snippetIndex
            );
            var { output } = evaluatedSnippet;
            if (output === null) {
              throw new Error('snippet was not correctly evaluted');
            }
            if (
              output.kind === 'error' &&
              !this.isNextEvaluatedSnippetOutput(snippetIndex)
            ) {
              expect.fail(
                `snippet evaluation caused an error\n\n${output.text}`
              );
            }
          });
        });
      }
    );
  });

  describe('when a block is evaluated', function () {
    it('should output a diff for a mismatch between evaluated output and the markdown', function () {
      const input = convertMarkdownToMocha(
        `${fences('return 456;')}\n${fences('123', 'output')}`
      ).code;
      const env = createTestRunnerEnvironment(codeToString(input));

      expect(
        () => vm.runInNewContext(env.code, env.context),
        'to be rejected with',
        "expected '456' to equal '123'\n\n-456\n+123"
      );
    });
  });
});
