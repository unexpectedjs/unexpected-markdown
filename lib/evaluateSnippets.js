var vm = require('vm');
var fs = require('fs');
var createExpect = require('./createExpect');
var locateBabelrc = require('./locateBabelrc');

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
      compact: false
    });

    return babelResult.code.replace(/'use strict';/, '');
  };
} catch (e) {
  transpile = function transpile(code) {
    // Avoid "Identifier '...' has already been declared"
    return code.replace(/\b(?:const|let)\s/g, 'var ');
  };
}

function isPromise(value) {
  return value && typeof value.then === 'function';
}

function getErrorMessage(expect, format, error) {
  if (error) {
    if (error.getErrorMessage) {
      var output = expect.createOutput
        ? expect.createOutput(format)
        : expect.output.clone(format);
      return error.getErrorMessage({ output: output }).toString(format);
    } else if (error.output) {
      return error.output.toString(format);
    } else {
      return expect.output
        .clone(format)
        .error((error && error.message) || '')
        .toString(format);
    }
  } else {
    return '';
  }
}

module.exports = async function(snippets, options) {
  const baseExpect = createExpect({ ...options, theme: 'notheme' });

  const context = {};
  context.require = require;
  for (const [variable, createVariable] of Object.entries(
    (options && options.globals) || {}
  )) {
    context[variable] = createVariable(options);
  }
  // grab a reference before any modifications are done to it
  const testExpect =
    global.expect && global.expect._topLevelExpect ? global.expect : null;

  if (hasBabel) {
    var preambleSeparator =
      '\n//---------------------preamble----------------------\n';
    var separator = '\n//---------------------separator---------------------\n';

    var exampleSnippets = snippets.filter(function(snippet) {
      return snippet.lang === 'javascript' && snippet.flags.evaluate;
    });

    if (exampleSnippets.length) {
      var codeForTranspilation =
        preambleSeparator +
        exampleSnippets
          .map(function(snippet) {
            return snippet.flags.async
              ? `(function () {${snippet.code}})();`
              : snippet.code;
          })
          .join(separator);

      var transpiledCode = transpile(codeForTranspilation);
      var transpiledSnippets = transpiledCode.split(
        new RegExp(`${preambleSeparator}|${separator}`)
      );

      var preamble = transpiledSnippets[0];
      const remainingSnippets = transpiledSnippets.slice(1);

      vm.runInNewContext(preamble, context);

      for (const [i, transpiledSnippet] of remainingSnippets.entries()) {
        exampleSnippets[i].code = transpiledSnippet;
      }
    }
  }

  for (const snippet of snippets) {
    if (snippet.lang === 'javascript' && snippet.flags.evaluate) {
      try {
        if (snippet.flags.freshExpect) {
          if (!testExpect) {
            throw new Error(
              'cannot clone with missing or invalid expect global for freshExpect'
            );
          }
          context.expect = testExpect.clone();
        }

        if (snippet.flags.async) {
          var promise = vm.runInNewContext(
            hasBabel
              ? snippet.code
              : `(function () {${transpile(snippet.code)}})();`,
            context
          );

          if (!isPromise(promise)) {
            throw new Error(
              `Async code block did not return a promise or throw\n${snippet.code}`
            );
          }

          await promise;
        } else {
          vm.runInNewContext(
            hasBabel ? snippet.code : transpile(snippet.code),
            context
          );
        }
      } catch (e) {
        snippet.htmlErrorMessage = getErrorMessage(baseExpect, 'html', e);
        snippet.errorMessage = getErrorMessage(baseExpect, 'text', e);
      }
    }
  }
};
