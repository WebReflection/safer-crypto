/*! (c) Andrea Giammarchi - ISC */

import {apply, bind} from 'safer-function';
import {resolve} from 'safer-promise';

const {freeze, defineProperty, getOwnPropertyNames, getPrototypeOf} = Object;
const isMethod = (self, key) => (
  !/^(?:caller|callee|arguments)$/.test(key) &&
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

export default freeze(defineProperty(saferCrypto, 'subtle', {
  enumerable: true,
  value: freeze(saferSubtle)
}));
