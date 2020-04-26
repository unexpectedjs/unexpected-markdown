var fs = require('fs');
var pathModule = require('path');
var convertMarkdownToMocha = require('./convertMarkdownToMocha');

var maps = {};

// Make the md-to-mocha transpiler avaliable as a side effect of requiring unexpected-markdown
// so that mocha --compilers md:unexpected-markdown will work:
// eslint-disable-next-line node/no-deprecated-api
require.extensions['.md'] = function (module, fileName) {
  var sourceMapWithCode = convertMarkdownToMocha(
    fs.readFileSync(fileName, 'utf-8'),
    fileName
  );

  var absoluteFileName = pathModule.resolve(process.cwd(), fileName);

  // Register the source map with the main UnexpectedMarkdown, which tries to detect the source-map-support
  // module and registers a handler with it:
  var map = sourceMapWithCode.map.toString();
  var code = sourceMapWithCode.code;

  maps[absoluteFileName] = map;

  const outputFile = pathModule.join(
    pathModule.dirname(fileName),
    pathModule.basename(fileName, '.md') + '.js'
  );
  fs.writeFileSync(outputFile, code, 'utf8');

  module._compile(code, fileName);
};

var sourceMapSupport;
try {
  sourceMapSupport = require.main.require('source-map-support');
} catch (e) {
  sourceMapSupport = require('source-map-support');
}

if (sourceMapSupport) {
  sourceMapSupport.install({
    handleUncaughtExceptions: false,
    retrieveSourceMap: function (source) {
      return maps[source] ? { url: null, map: maps[source] } : null;
    },
  });
}
