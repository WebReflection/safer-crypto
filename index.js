var saferCrypto = (function (exports) {
  'use strict';

  /*! (c) Andrea Giammarchi - ISC */
  var call = Function.call;
  var bind = call.bind(call.bind);
  var apply = bind(call, call.apply);
  call = bind(call, call);

  /*! (c) Andrea Giammarchi - ISC */

  const {
    defineProperty,
    getPrototypeOf,
    getOwnPropertyDescriptor,
    getOwnPropertyNames,
    getOwnPropertySymbols,
    hasOwnProperty
  } = Object;

  const {concat, forEach, includes, push} = [];

  const falsify = (descriptor, name) => {
    defineProperty(descriptor, name, {
      enumerable: true,
      value: false
    });
  };

  const updated = descriptor => {
    falsify(descriptor, 'configurable');
    if (call(hasOwnProperty, descriptor, 'writable'))
      falsify(descriptor, 'writable');
    return descriptor;
  };

  var saferObject = object => {
    const self = object;
    const names = [];
    const descriptors = [];
    do {
      call(
        forEach,
        call(
          concat,
          getOwnPropertyNames(object),
          getOwnPropertySymbols(object)
        ),
        name => {
          if (!call(includes, names, name)) {
            call(push, names, name);
            call(push, descriptors, getOwnPropertyDescriptor(object, name));
          }
        }
      );
    }
    while (object = getPrototypeOf(object));
    call(forEach, names, (name, i) => {
      defineProperty(self, name, updated(descriptors[i]));
    });
    return self;
  };

  /*! (c) Andrea Giammarchi - ISC */

  var saferClass = Class => (
    saferObject(Class.prototype),
    saferObject(Class)
  );

  const {freeze, setPrototypeOf} = Object;
  const {reject: _reject, resolve: _resolve} = Promise;

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

  saferClass(SaferPromise);
  freeze(SaferPromise);
  freeze(prototype);

  /*! (c) Andrea Giammarchi - ISC */

  const {freeze: freeze$1, defineProperty: defineProperty$1, getOwnPropertyNames: getOwnPropertyNames$1, getPrototypeOf: getPrototypeOf$1} = Object;
  const isMethod = (self, key) => (
    !/^(?:caller|callee|arguments)$/.test(key) &&
    typeof self[key] === 'function' &&
    key !== 'constructor'
  );

  const {subtle} = crypto;

  const saferCrypto = {};
  const saferSubtle = {};

  getOwnPropertyNames$1(getPrototypeOf$1(crypto)).forEach(key => {
    if (isMethod(crypto, key)) {
      defineProperty$1(saferCrypto, key, {
        enumerable: true,
        value: bind(crypto[key], crypto)
      });
    }
  });

  getOwnPropertyNames$1(getPrototypeOf$1(subtle)).forEach(key => {
    if (isMethod(subtle, key)) {
      const method = subtle[key];
      defineProperty$1(saferSubtle, key, {
        enumerable: true,
        value() {
          return resolve(apply(method, subtle, arguments));
        }
      });
    }
  });

  var index = freeze$1(defineProperty$1(saferCrypto, 'subtle', {
    enumerable: true,
    value: freeze$1(saferSubtle)
  }));

  

  return index;

}({}));
