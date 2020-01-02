/* global unexpected */
module.exports = function(options) {
  options = { ...options };
  var expect;
  if (options.unexpected) {
    expect = options.unexpected.clone();
  } else if (typeof unexpected === 'undefined') {
    expect = require('unexpected').clone();
    expect.output.preferredWidth = 80;
  } else {
    expect = unexpected.clone();
  }

  if (options.preferredWidth) {
    expect.output.preferredWidth = options.preferredWidth;
  }

  if (typeof options.indentationWidth === 'number') {
    expect.output.indentationWidth = options.indentationWidth;
  }
  expect.installPlugin(require('magicpen-prism'));

  if (options.theme !== 'notheme') {
    var themePlugin =
      options.theme === 'dark'
        ? require('./magicpenDarkSyntaxTheme')
        : require('./magicpenGithubSyntaxTheme');

    expect.installPlugin(themePlugin);
  }

  return expect;
};
