var saferCrypto = (function (exports) {
  'use strict';

  var call = Function.call;
  var bind = call.bind(call.bind);
  var apply = bind(call, call.apply);
  call = bind(call, call);

  const {freeze, setPrototypeOf} = Object;
  const {prototype: _prototype, reject: _reject, resolve: _resolve} = Promise;
  const {catch: _catch, then: _then} = _prototype;

  class SaferPromise extends Promise {
    static reject(value) {
      return call(_reject, SaferPromise, convert(value));
    }
    static resolve(value) {
      return call(_resolve, SaferPromise, convert(value));
    }
    constructor(fn) {
      freeze(super(fn));
    }
    catch() {
      return apply(_catch, this, arguments);
    }
    then() {
      return apply(_then, this, arguments);
    }
  }

  const {prototype, reject, resolve} = SaferPromise;
  const convert = value => (
    typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    !(value instanceof SaferPromise) ?
      setPrototypeOf(value, prototype) :
      value
  );

  freeze(SaferPromise);
  freeze(prototype);

  const {freeze: freeze$1, defineProperty, getOwnPropertyNames, getPrototypeOf} = Object;
  const isMethod = (self, key) => (
    typeof self[key] === 'function' &&
    key !== 'constructor'
  );

  const {subtle} = crypto;

  const saferCrypto = {};
  const saferSubtle = {};

  getOwnPropertyNames(getPrototypeOf(crypto)).forEach(key => {
    if (isMethod(crypto, key)) {
      defineProperty(saferCrypto, key, {
        enumerable: true,
        value: bind(crypto[key], crypto)
      });
    }
  });

  getOwnPropertyNames(getPrototypeOf(subtle)).forEach(key => {
    if (isMethod(subtle, key)) {
      const method = subtle[key];
      defineProperty(saferSubtle, key, {
        enumerable: true,
        value() {
          return resolve(apply(method, subtle, arguments));
        }
      });
    }
  });

  var index = freeze$1(defineProperty(saferCrypto, 'subtle', {
    enumerable: true,
    value: freeze$1(saferSubtle)
  }));

  

  return SaferPromise;

}({}));
