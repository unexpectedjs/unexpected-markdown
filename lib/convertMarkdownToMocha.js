/* global unexpected:true */
var fs = require('fs');
var pathModule = require('path');
var esprima = require('esprima');
var escodegen = require('escodegen');
var { Markdown } = require('evaldown');

var locateBabelrc = require('./locateBabelrc');
var cleanStackTrace = require('./cleanStackTrace');
var resolvedPathToEvaldown = require.resolve('evaldown');

var transpile;
var hasBabel = false;
try {
  var babelCore = require.main.require('babel-core');
  var babelrc = locateBabelrc();
  var babelOptions = JSON.parse(fs.readFileSync(babelrc, 'utf-8'));
  hasBabel = true;

  transpile = function transpile(code) {
    var babelResult = babelCore.transform(code, {
      ...babelOptions,
      sourceMaps: false,
      compact: false,
    });

    return babelResult.code.replace(/'use strict';/, '');
  };
} catch (e) {
  transpile = function transpile(code) {
    return code;
  };
}

function parseFunctionBody(fn) {
  return esprima.parse(fn.toString()).body[0].body.body;
}

function instrumentReturns(astNode, exampleNumber) {
  if (Array.isArray(astNode)) {
    for (var i = 0; i < astNode.length; i += 1) {
      var statement = astNode[i];
      if (statement.type === 'ReturnStatement') {
        astNode.splice(
          i,
          1,
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: `__returnValue${exampleNumber}`,
              },
              right: statement.argument,
            },
          },
          {
            type: 'BreakStatement',
            label: {
              type: 'Identifier',
              name: `example${exampleNumber}`,
            },
          }
        );
      } else if (statement.type === 'IfStatement') {
        instrumentReturns(statement.consequent, exampleNumber);
        instrumentReturns(statement.alternate, exampleNumber);
      }
    }
  } else if (astNode && typeof astNode === 'object') {
    if (astNode.type === 'BlockStatement') {
      instrumentReturns(astNode.body, exampleNumber);
    }
  }
}

function makeTryCatchConstruct(exampleNumber, topLevelStatements) {
  /* eslint-disable */
  var tryCatch = parseFunctionBody(
    /* istanbul ignore next */
    function f() {
      var __returnValueX;
      exampleX: try {
      } catch (err) {
        return endOfExampleX(err);
      }
      if (isPromise(__returnValueX)) {
        return __returnValueX.then(function () {
          return endOfExampleX();
        }, endOfExampleX);
      } else {
        return endOfExampleX();
      }
      function endOfExampleX(err) {}
    }
  );
  /* eslint-enable */

  tryCatch[0].declarations[0].id.name = `__returnValue${exampleNumber}`;
  tryCatch[1].label.name = `example${exampleNumber}`;
  tryCatch[1].body.handler.body.body[0].argument.callee.name = `endOfExample${exampleNumber}`;
  tryCatch[2].test.arguments[0].name = `__returnValue${exampleNumber}`;
  tryCatch[2].consequent.body[0].argument.callee.object.name = `__returnValue${exampleNumber}`;
  tryCatch[2].consequent.body[0].argument.arguments[1].name = `endOfExample${exampleNumber}`;
  tryCatch[2].consequent.body[0].argument.arguments[0].body.body[0].argument.callee.name = `endOfExample${exampleNumber}`;
  tryCatch[2].alternate.body[0].argument.callee.name = `endOfExample${exampleNumber}`;
  tryCatch[3].id.name = `endOfExample${exampleNumber}`;

  instrumentReturns(topLevelStatements, exampleNumber);

  Array.prototype.push.apply(tryCatch[1].body.block.body, topLevelStatements);
  return tryCatch;
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
  var codeBlocks = [];
  const snippets = new Markdown(mdSrc, {
    marker: 'unexpected-markdown',
  }).getSnippets();
  for (const codeBlock of snippets.items) {
    codeBlock.lineNumber = 1 + countLinesUntilIndex(mdSrc, codeBlock.index);
    if (codeBlock.lang === 'output') {
      var lastJavaScriptBlock = codeBlocks[codeBlocks.length - 1];
      if (!lastJavaScriptBlock || lastJavaScriptBlock.output) {
        throw new Error('output block must follow code block');
      }
      lastJavaScriptBlock.output = codeBlock.code;
      lastJavaScriptBlock.outputFlags = codeBlock.flags || {};
    } else if (codeBlock.lang === 'javascript' && codeBlock.flags.evaluate) {
      codeBlocks.push(codeBlock);
    }
  }
  return codeBlocks;
}

function compileCodeBlocksToAst(codeBlocks, fileName) {
  var top = [];
  var cursor = top;
  for (const [i, codeBlock] of codeBlocks.entries()) {
    var previousExampleNumber = i + 1;
    var topLevelStatements = esprima.parse(
      `${new Array(codeBlock.lineNumber).join('\n')}(function () {\n${
        codeBlock.code
      }\n}());`,
      { loc: true, source: pathModule.resolve(fileName) }
    ).body[0].expression.callee.body.body;

    for (const [
      statementIndex,
      topLevelStatement,
    ] of topLevelStatements.entries()) {
      switch (topLevelStatement.type) {
        case 'VariableDeclaration':
          topLevelStatement.kind = 'var';
          break;
        case 'FunctionDeclaration':
          var newStatement = {
            loc: topLevelStatement.loc,
            type: 'VariableDeclaration',
            declarations: [
              {
                loc: topLevelStatement.loc,
                type: 'VariableDeclarator',
                id: topLevelStatement.id,
                init: topLevelStatement,
              },
            ],
            kind: 'var',
          };
          topLevelStatements[statementIndex] = newStatement;
          break;
      }
    }

    if (codeBlock.flags.freshContext) {
      Array.prototype.push.apply(
        cursor,
        parseFunctionBody(
          /* istanbul ignore next */
          function f(expect) {
            expect = globalExpect.clone();
          }
        )
      );
    }
    var tryCatch = makeTryCatchConstruct(
      previousExampleNumber,
      topLevelStatements
    );

    Array.prototype.push.apply(cursor, tryCatch);

    cursor = tryCatch[3].body.body;
    if (i === codeBlocks.length - 1) {
      var check;
      if (typeof codeBlock.output === 'string') {
        check = parseFunctionBody(
          /* istanbul ignore next */
          function f(err, expect) {
            if (err) {
              var message = err.isUnexpected
                ? err.getErrorMessage('text').toString()
                : err.message;
              expect(expectedOutput, 'to equal', evaluatedSnippet.code);
            } else {
              throw new Error('expected example to fail');
            }
          }
        );
        /*
        check[0].consequent.body[1].expression.arguments[2].value =
          codeBlock.output;
        */
        if (codeBlock.outputFlags.cleanStackTrace) {
          check[0].consequent.body.splice(1, 0, {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'message',
              },
              right: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'cleanStackTrace',
                },
                arguments: [
                  {
                    type: 'Identifier',
                    name: 'message',
                  },
                ],
              },
            },
          });
          check.unshift(esprima.parse(cleanStackTrace.toString()).body[0]);
        }
      } else {
        check = parseFunctionBody(
          /* istanbul ignore next */
          function f(err, expect) {
            if (err) {
              expect.fail(err);
            }
          }
        );
      }
      Array.prototype.push.apply(cursor, check);
    }
  }
  return top;
}

module.exports = function (mdSrc, fileName) {
  if (fileName) {
    fileName = pathModule.relative(process.cwd(), fileName);
  } else {
    fileName = '<inline code>';
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
        function isPromise(obj) {
          return obj && typeof obj.then === 'function';
        }
        describe('', function () {
          var expect = globalExpect.clone();
          expect.output.preferredWidth = 80;

          before(async function () {
            var md = await new Markdown('', {
              marker: 'unexpected-markdown',
              pwdPath: '',
            });
            await md.evaluate();
            this.evaluatedSnippets = (
              await md.withUpdatedExamples()
            ).getSnippets();
          });
        });
      }
    ),
  };
  /* eslint-enable */

  var requireCall = ast.body[0].declarations[0].init;
  requireCall.arguments[0].value = resolvedPathToEvaldown;

  var describeCall = ast.body[3].expression;
  describeCall.arguments[0].value = pathModule.basename(fileName, '.md');

  var beforeEachCall = describeCall.arguments[1].body.body[2].expression;
  // set the mdSrc as the first argument to the Markdown constructor
  beforeEachCall.arguments[0].body.body[0].declarations[0].init.argument.arguments[0].value = mdSrc;
  // set the current directory name as the pwdPath option key value
  beforeEachCall.arguments[0].body.body[0].declarations[0].init.argument.arguments[1].properties[1].value.value = process.cwd();

  var preamble;
  if (hasBabel && codeBlocks.length) {
    var preambleSeparator =
      '\n//---------------------um-preamble----------------------\n';
    var separator =
      '\n//---------------------um-separator---------------------\n';
    var transpiledCode = transpile(
      preambleSeparator +
        codeBlocks
          .map(function (codeBlock) {
            return codeBlock.flags.async
              ? `(function unexpectedMarkdownScope() {${codeBlock.code}})("unexpectedMarkdownScope");`
              : codeBlock.code;
          })
          .join(separator)
    );

    var transpiledBlocks = transpiledCode.split(
      new RegExp(`${preambleSeparator}|${separator}`)
    );

    preamble = esprima.parse(transpiledBlocks[0]);
    const remainingBlocks = transpiledBlocks.slice(1);

    for (const [i, transpiledBlock] of remainingBlocks.entries()) {
      if (codeBlocks[i].flags.async) {
        codeBlocks[i].code = transpiledBlock
          .replace(/^\(function unexpectedMarkdownScope\(\) \{\n/, '')
          .replace(/\n\}\)\("unexpectedMarkdownScope"\);$/, '')
          .replace(/^ {4}/gm, '');
      } else {
        codeBlocks[i].code = transpiledBlock;
      }
    }
  }

  var nowrapBlocks = [];

  for (const [i, codeBlock] of codeBlocks.entries()) {
    var exampleNumber = i + 1;
    /* eslint-disable */
    var itExpressionStatement = parseFunctionBody(
      /* istanbul ignore next */
      function f() {
        it('', function () {
          var snippetIndex = 0;
          var evaluatedSnippet = this.evaluatedSnippets.get(snippetIndex);
          var expectedOutput = '';
        });
      }
    )[0];
    /* eslint-enable */
    var testName = `example #${exampleNumber} (${fileName}:${
      codeBlock.lineNumber + 1
    }:1) should ${
      typeof codeBlock.output === 'string'
        ? 'fail with the correct error message'
        : 'succeed'
    }`;
    itExpressionStatement.expression.arguments[0].value = testName;

    itExpressionStatement.expression.arguments[1].body.body[0].declarations[0].init.value = i;

    itExpressionStatement.expression.arguments[1].body.body[2].declarations[0].init.value =
      codeBlock.code;

    if (preamble) {
      itExpressionStatement.expression.arguments[1].body.body.push(preamble);
    }

    describeCall.arguments[1].body.body.push(itExpressionStatement);

    Array.prototype.push.apply(
      itExpressionStatement.expression.arguments[1].body.body,
      compileCodeBlocksToAst(nowrapBlocks.concat(codeBlocks[i]), fileName)
    );

    if (!codeBlock.output && codeBlock.flags.nowrap) {
      nowrapBlocks.push(codeBlock);
    }
  }
  return escodegen.generate(ast, { sourceMap: true, sourceMapWithCode: true });
};
