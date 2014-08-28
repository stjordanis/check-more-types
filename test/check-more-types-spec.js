require('lazy-ass');
global.check = require('check-types');
require('../check-more-types');

describe('check-more-types', function () {
  var root = typeof window === 'object' ? window : global;

  it('has check', function () {
    la(global.check);
    la(typeof check == 'object');
    la(check.object(check));
  });

  it('has extra checks', function () {
    la(check.fn(check.bit));
    la(check.fn(check.lowerCase));
  });

  /** @sample check/raises */
  describe('check.raises', function () {
    la(check.fn(check.raises));

    function foo() {
      throw new Error('foo');
    }

    function bar() {}

    function isValidError(err) {
      return err.message === 'foo';
    }

    function isInvalid(err) {
      return false;
    }

    it('just checks if function raises error', function () {
      la(check.raises(foo));
      la(!check.raises(bar));
    });

    it('can validate error using second argument', function () {
      la(check.raises(foo, isValidError));
      la(!check.raises(foo, isInvalid));
    });
  });

  describe('check.raises example', function () {
    it('check.raises(fn, validator)', function () {
      function foo() {
        throw new Error('foo');
      }

      function bar() {}

      function isValidError(err) {
        return err.message === 'foo';
      }

      function isInvalid(err) {
        return false;
      }

      la(check.raises(foo));
      la(!check.raises(bar));
      la(check.raises(foo, isValidError));
      la(!check.raises(foo, isInvalid));
    });
  });

  describe('check.defined', function () {
    la(check.fn(check.bit));

    /** @sample check/defined */
    it('detects defined or not', function () {
      la(check.defined(0));
      la(check.defined(1));
      la(check.defined(true));
      la(check.defined(false));
      la(check.defined(null));
      la(check.defined(''));
      la(!check.defined());
      la(!check.defined(root.does_not_exist));
      la(!check.defined({}.does_not_exist));
    });

    it('check.defined', function () {
      la(check.defined(0));
      la(check.defined(1));
      la(check.defined(true));
      la(check.defined(false));
      la(check.defined(null));
      la(check.defined(''));
      la(!check.defined());
      la(!check.defined(root.does_not_exist));
      la(!check.defined({}.does_not_exist));
    });
  });

  describe('check.bool', function () {
    la(check.fn(check.bool));

    it('check.bool', function () {
      la(check.bool(true));
      la(check.bool(false));
      la(!check.bool(0));
      la(!check.bool(1));
      la(!check.bool('1'));
      la(!check.bool(2));
    });
  });

  describe('check.bit', function () {
    la(check.fn(check.bit));

    /** @sample check/bit */
    it('detects 0/1', function () {
      la(check.bit(0));
      la(check.bit(1));
      la(!check.bit('1'));
      la(!check.bit(false));
    });

    it('passes', function () {
      la(check.bit(0));
      la(check.bit(1));
    });

    it('fails', function () {
      la(!check.bit('0'));
      la(!check.bit('1'));
      la(!check.bit(2));
      la(!check.bit(true));
      la(!check.bit(false));
    });

    it('check.bit', function () {
      la(check.bit(0));
      la(check.bit(1));
      la(!check.bit('1'));
      la(!check.bit(2));
      la(!check.bit(true));
    });
  });

  describe('check.unemptyArray', function () {
    la(check.fn(check.unemptyArray));

    /** @sample check/defined */
    it('check.unemptyArray', function () {
      la(!check.unemptyArray(null));
      la(!check.unemptyArray(1));
      la(!check.unemptyArray({}));
      la(!check.unemptyArray([]));
      la(!check.unemptyArray(root.does_not_exist));
      la(check.unemptyArray([1]));
      la(check.unemptyArray(['foo', 'bar']));
    });

  });

  describe('verify.all', function () {
    it('is a function', function () {
      la(check.fn(check.all));
      la(check.fn(check.verify.all));
    });

    it('requires arguments', function () {
      la(check.raises(function () {
        check.all();
      }));

      la(check.raises(function () {
        check.verify.all();
      }));

      la(check.raises(function () {
        check.verify.all({});
      }));

      la(check.raises(function () {
        check.verify.all({}, {});
      }));
    });

    it('accepts empty objects', function () {
      la(check.all({}, {}));
      check.verify.all({}, {}, 'empty objects');
    });

    it('does nothing if everything is correct', function () {
      check.verify.all({
        foo: 'foo'
      }, {
        foo: check.unemptyString
      }, 'foo property');
    });

    it('throws an error if a property does not pass', function () {
      la(check.raises(function () {
        check.verify.all({
          foo: 'foo'
        }, {
          foo: check.number
        }, 'foo property');
      }));
    });

    it('fails if a predicate is not a function', function () {
      la(check.raises(function () {
        check.all({}, {
          foo: check.doesNotExistCheck
        });
      }));
    });

    describe('check.all partial', function () {
      it('check.all', function () {
        var obj = {
          foo: 'foo',
          bar: 'bar',
          baz: 'baz'
        };
        var predicates = {
          foo: check.unemptyString,
          bar: function (value) {
            return value === 'bar';
          }
        };
        la(check.all(obj, predicates));
      });

      /** @sample check/all */
      it('checks an object', function () {
        function fooChecker(value) {
          return value === 'foo';
        }
        la(check.all({ foo: 'foo' }, { foo: fooChecker }));
      });

      /** @sample check/all */
      it('extra properties are allowed', function () {
        var obj = {
          foo: 'foo',
          bar: 'bar'
        };
        var predicates = {
          foo: check.unemptyString
        };
        la(check.all(obj, predicates));
      });

      it('succeeds if there are extra properties', function () {
        la(check.all({
          foo: 'foo',
          bar: 'bar'
        }, {
          foo: check.unemptyString
        }));
      });

      it('succeeds if there are extra false properties', function () {
        la(check.all({
          foo: 'foo',
          bar: false
        }, {
          foo: check.unemptyString
        }));
      });
    });
  });

  describe('arrayOfStrings', function () {
    it('has check', function () {
      la(check.fn(check.arrayOfStrings));
      la(check.fn(check.verify.arrayOfStrings));
    });

    it('check.arrayOfStrings', function () {
      // second argument is checkLowerCase
      la(check.arrayOfStrings(['foo', 'Foo']));
      la(!check.arrayOfStrings(['foo', 'Foo'], true));
      la(check.arrayOfStrings(['foo', 'bar'], true));
      la(!check.arrayOfStrings(['FOO', 'BAR'], true));
    });

    it('checks if strings are lower case', function () {
      la(check.arrayOfStrings(['foo', 'Foo']));
      la(!check.arrayOfStrings(['foo', 'Foo'], true));
      la(check.arrayOfStrings(['foo', 'bar'], true));
      la(!check.arrayOfStrings(['FOO', 'BAR'], true));
    });

    it('passes', function () {
      la(check.arrayOfStrings([]));
      la(check.arrayOfStrings(['foo']));
      la(check.arrayOfStrings(['foo', 'bar']));

      check.verify.arrayOfStrings([]);
      check.verify.arrayOfStrings(['foo']);
      check.verify.arrayOfStrings(['foo', 'bar']);
    });

    it('fails', function () {
      la(check.raises(function () {
        check.verify.arrayOfStrings('foo');
      }));

      la(check.raises(function () {
        check.verify.arrayOfStrings([1]);
      }));

      la(check.raises(function () {
        check.verify.arrayOfStrings(['foo', 1]);
      }));
    });

    /** @sample check/arrayOfStrings */
    it('works', function () {
      la(check.arrayOfStrings(['foo', 'BAR']));
      la(!check.arrayOfStrings(['foo', 4]));
      // can check lower case
      la(!check.arrayOfStrings(['foo', 'Bar'], true));
      // lower case flag should be boolean
      la(check.arrayOfStrings(['foo', 'Bar'], 1));
    });

  });

  describe('arrayOfArraysOfStrings', function () {
    it('has check', function () {
      la(check.fn(check.arrayOfArraysOfStrings));
      la(check.fn(check.verify.arrayOfArraysOfStrings));
    });

    it('check.arrayOfArraysOfStrings', function () {
      // second argument is checkLowerCase
      la(check.arrayOfArraysOfStrings([['foo'], ['bar']]));
      la(check.arrayOfArraysOfStrings([['foo'], ['bar']], true));
      la(!check.arrayOfArraysOfStrings([['foo'], ['BAR']], true));
    });

    /** @sample check/arrayOfArraysOfStrings */
    it('checks if all strings are lower case', function () {
      la(check.arrayOfArraysOfStrings([['foo'], ['bar']]));
      la(check.arrayOfArraysOfStrings([['foo'], ['bar']], true));
      la(!check.arrayOfArraysOfStrings([['foo'], ['BAR']], true));
    });

    it('returns true', function () {
      la(check.arrayOfArraysOfStrings([[]]));
      la(check.arrayOfArraysOfStrings([['foo'], ['bar']]));
    });

    it('returns false', function () {
      la(!check.arrayOfArraysOfStrings([['foo', true]]));
      la(!check.arrayOfArraysOfStrings([['foo'], ['bar'], [1]]));
    });

    it('passes', function () {
      check.verify.arrayOfArraysOfStrings([[]]);
      check.verify.arrayOfArraysOfStrings([['foo']]);
      check.verify.arrayOfArraysOfStrings([['foo'], ['bar'], []]);
    });

    it('fails', function () {
      la(check.raises(function () {
        check.verify.arrayOfArraysOfStrings('foo');
      }));

      la(check.raises(function () {
        check.verify.arrayOfArraysOfStrings([1]);
      }));

      la(check.raises(function () {
        check.verify.arrayOfArraysOfStrings(['foo', 1]);
      }));

      la(check.raises(function () {
        check.verify.arrayOfArraysOfStrings([['foo', 1]]);
      }));
    });
  });

  describe('lowerCase', function () {
    it('check.lowerCase', function () {
      la(check.lowerCase('foo bar'));
      la(check.lowerCase('*foo ^bar'));
      la(!check.lowerCase('fooBar'));
      // non-strings return false
      la(!check.lowerCase(10));
    });

    /** @sample check/lowerCase */
    it('checks lower case', function () {
      la(check.lowerCase('foo bar'));
      la(check.lowerCase('*foo ^bar'));
      la(!check.lowerCase('fooBar'));
    });

    it('passes lower case with spaces', function () {
      la(check.lowerCase('foo'));
      la(check.lowerCase('foo bar'));
      la(check.lowerCase('  foo bar  '));
    });

    it('handles special chars', function () {
      la(check.lowerCase('^tea'));
      la(check.lowerCase('$tea'));
      la(check.lowerCase('s&p 500'));
    });

    it('rejects upper case', function () {
      la(!check.lowerCase('Foo'));
      la(!check.lowerCase('FOO '));
      la(!check.lowerCase('FOO BAR'));
      la(!check.lowerCase('foo bAr'));
    });

    it('returns true', function () {
      la(check.fn(check.lowerCase), 'it is a function');
      la(check.lowerCase('foo 2 []'));
      la(check.lowerCase('-_foo_ and another bar'));
    });

    it('returns false', function () {
      la(!check.lowerCase('FoO'));
    });

    it('returns false for non strings', function () {
      la(!check.lowerCase([]));
      la(!check.lowerCase(7));
      la(!check.lowerCase({ foo: 'foo' }));
    });
  });

  describe('has', function () {
    it('check.has(obj, property)', function () {
      var obj = {
        foo: 'foo',
        bar: 0
      };
      la(check.has(obj, 'foo'));
      la(check.has(obj, 'bar'));
      la(!check.has(obj, 'baz'));
      // non-object returns false
      la(!check.has(5, 'foo'));
      la(check.has('foo', 'length'));
    });

    it('passes', function () {
      var o = {
        foo: '',
        bar: 'something',
        baz: 0
      };
      la(check.fn(check.has));
      la(check.has(o, 'foo'));
      la(check.has(o, 'bar'));
      la(check.has(o, 'baz'));
    });

    /** @example check/has */
    it('works for non-objects', function () {
      la(check.has('str', 'length'), 'string length');
      la(check.has([], 'length'), 'array length');
    });

    it('fails for invalid args', function () {
      la(!check.has(), 'no arguments');
      la(!check.has({}), 'no property name');
      la(!check.has({}, 99), 'invalid property name');
      la(!check.has({}, ''), 'empty property name');
    });

    it('fails for missing properties', function () {
      la(!check.has({}, 'foo'));
    });
  });

  describe('maybe modifier', function () {
    it('default maybe from check-types.js', function () {
      la(check.object(check.maybe), 'check.maybe is an object');
      la(check.fn(check.maybe.fn), 'check.maybe.fn function');
      la(check.maybe.fn(), 'undefined is maybe a function');
      la(check.maybe.fn(null), 'null is maybe a function');
    });

    it('check.maybe.bit', function () {
      la(check.fn(check.maybe.bit), 'check.maybe.bit function');
      la(check.maybe.bit(1));
      la(check.maybe.bit());
      la(check.maybe.bit(null));
      la(!check.maybe.bit(4));
    });
  });

});
