<!-- unexpected-markdown nowrap:true -->

```js
function Timelock(value, delay) {
  this.value = value;
  this.delay = delay;
}

Timelock.prototype.getValue = function (cb) {
  var that = this;
  setTimeout(function () {
    cb(that.value);
  }, this.delay);
};
```

```js
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
```

Let's see how it works:

```js
return expect(
  new Timelock('Hello world!', 5),
  'to satisfy',
  expect.it('not to match', /!/)
);
```

```output
expected Timelock to satisfy expect.it('not to match', /!/)

expected 'Hello world!' not to match /!/

Hello world!
           ^
```

The best resource for learning more about custom assertions is to look
at how the predefined assertions are built:

[lib/assertions.js](https://github.com/unexpectedjs/unexpected/blob/master/lib/assertions.js)
