var pathModule = require('path');
var esprima = require('esprima');
var escodegen = require('escodegen');
var { Markdown } = require('evaldown');

var resolvedPathToEvaldown = require.resolve('evaldown');

function checkCodeBlockSkipped(codeBlock) {
  const { lang, flags } = codeBlock;

  if (!(lang === 'javascript' || lang === 'output')) {
    return true;
  } else if (lang === 'javascript' && !flags.evaluate) {
    return true;
  }

  return false;
}

function parseFunctionBody(fn) {
  return esprima.parse(fn.toString()).body[0].body.body;
}

function countLinesUntilIndex(text, untilIndex) {
  var count = 0;
  text.replace(/\r\n?|\n\r?/g, function ($0, index) {
    if (index < untilIndex) {
      count += 1;
    }
  });
  return count;
}

function findCodeBlocks(mdSrc) {
  const snippets = new Markdown(mdSrc, {
    marker: 'unexpected-markdown',
  }).getSnippets();
  for (const codeBlock of snippets.items) {
    codeBlock.lineNumber = 1 + countLinesUntilIndex(mdSrc, codeBlock.index);
  }
  return snippets;
}

module.exports = function (mdSrc, filePath) {
  var fileName;
  if (filePath) {
    fileName = pathModule.relative(process.cwd(), filePath);
    filePath = pathModule.dirname(filePath);
  } else {
    fileName = '<inline code>';
    filePath = process.cwd();
  }

  var codeBlocks = findCodeBlocks(mdSrc);

  var ast = {
    type: 'Program',
    /* eslint-disable */
    body: parseFunctionBody(
      /* istanbul ignore next */
      function f() {
        var { Markdown } = require('');
        var globalExpect = global.expect;

        describe('', function () {
          var expect = globalExpect.clone();
          expect.output.preferredWidth = 80;

          before(async function () {
            var md = await new Markdown('', {
              marker: 'unexpected-markdown',
              capture: 'return',
              pwdPath: '',
              fileGlobals: {
                expect: () => expect.clone(),
              },
            });
            await md.evaluate();

            this.evaluatedSnippets = md.getSnippets();
            this.isNextEvaluatedSnippetOutput = (index) => {
              var nextSnippet = this.evaluatedSnippets.get(index + 1);
              return !!nextSnippet && nextSnippet.lang === 'output';
            };
          });
        });
      }
    ),
  };
  /* eslint-enable */

  var relativePathToEvaldown = pathModule.relative(
    pathModule.dirname(fileName),
    resolvedPathToEvaldown
  );

  var requireCall = ast.body[0].declarations[0].init;
  requireCall.arguments[0].value = `./${relativePathToEvaldown}`;

  var describeCall = ast.body[2].expression;
  describeCall.arguments[0].value = pathModule.basename(fileName, '.md');

  var beforeEachCall = describeCall.arguments[1].body.body[2].expression;
  var newMarkdown = beforeEachCall.arguments[0].body.body[0].declarations[0];
  // set the mdSrc as the first argument to the Markdown constructor
  newMarkdown.init.argument.arguments[0].value = mdSrc;
  // set the current file path file as the base of any in markdown require
  newMarkdown.init.argument.arguments[1].properties[2].value.value = filePath;

  for (const [i, codeBlock] of codeBlocks.entries()) {
    var exampleNumber = i + 1;
    var testName = `example #${exampleNumber} (${fileName}:${
      codeBlock.lineNumber + 1
    }:1)`;

    let isSkipped = false;
    let itExpressionStatement;
    if ((isSkipped = checkCodeBlockSkipped(codeBlock))) {
      /* eslint-disable */
      itExpressionStatement = parseFunctionBody(
        /* istanbul ignore next */
        function f() {
          it.skip('', function () {});
        }
      )[0];
      /* eslint-enable */
    } else {
      /* eslint-disable */
      itExpressionStatement = parseFunctionBody(
        /* istanbul ignore next */
        function f() {
          it('', function () {});
        }
      )[0];
      /* eslint-enable */

      testName += ` should ${
        codeBlock.lang === 'output'
          ? 'succeed with the correct output'
          : 'succeed'
      }`;
    }

    itExpressionStatement.expression.arguments[0].value = testName;

    describeCall.arguments[1].body.body.push(itExpressionStatement);

    if (isSkipped) {
      continue;
    }

    // add deferencing the corresponding evaluated snippet

    /* eslint-disable no-unused-vars */
    /* istanbul ignore next */
    var itSnippetStatements = parseFunctionBody(function f() {
      var snippetIndex = 0;
      var currentSnippet = this.evaluatedSnippets.get(snippetIndex);
      var evaluatedSnippet = this.evaluatedSnippets.get(
        currentSnippet.lang === 'output' ? snippetIndex - 1 : snippetIndex
      );
    });
    /* eslint-enable no-unused-vars */
    itSnippetStatements[0].declarations[0].init.value = i;
    Array.prototype.push.apply(
      itExpressionStatement.expression.arguments[1].body.body,
      itSnippetStatements
    );

    if (codeBlock.lang === 'output') {
      // assert the output in the markdown file is the same as the evaluated output

      /* eslint-disable no-undef */
      /* istanbul ignore next */
      var itOutputStatements = parseFunctionBody(function f() {
        var writtenOutput = '';
        expect(evaluatedSnippet.output.text, 'to equal', writtenOutput);
      });
      /* eslint-enable no-undef */
      itOutputStatements[0].declarations[0].init.value = codeBlock.code;
      Array.prototype.push.apply(
        itExpressionStatement.expression.arguments[1].body.body,
        itOutputStatements
      );
    } else {
      // assert that the snippet executed correctly

      /* eslint-disable no-undef */
      /* istanbul ignore next */
      var itEvaluatedSnippets = parseFunctionBody(function f() {
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
      /* eslint-enable no-undef */

      Array.prototype.push.apply(
        itExpressionStatement.expression.arguments[1].body.body,
        itEvaluatedSnippets
      );
    }
  }
  return escodegen.generate(ast, { sourceMap: true, sourceMapWithCode: true });
};
