# safer-crypto

<sup>**Social Media Photo by [freestocks.org](https://unsplash.com/@freestocks) on [Unsplash](https://unsplash.com/)**</sup>

[![Build Status](https://travis-ci.com/WebReflection/safer-crypto.svg?branch=master)](https://travis-ci.com/WebReflection/safer-crypto) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/safer-crypto/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/safer-crypto?branch=master) ![WebReflection status](https://offline.report/status/webreflection.svg)

A non observable Web Crypto API.

## Background

The Web Crypto API is configurable by default, and even if frozen in user-land, it's still vulnerable to `Promise.prototype.then` pollution.

While it is true that having unknown 3rd parts scripts interfering with your code is the root of unreliable JS, it is too damn simple to hook into the `crypto` API and sniff user passwords, server salts, encrypted data in clear, and so on and so fort.

### Attacks Examples
```js
// A crypto.subtle based attack
(() => {
  const {encrypt, decrypt, importKey} = crypto.subtle;
  Object.defineProperties(crypto.subtle, {
    importKey: {
      value(_, password) {
        console.log('user password', password);
        return importKey.apply(this, arguments);
      }
    },
    encrypt: {
      value(algo, key, data) {
        console.log('encrypting', new TextDecoder().decode(data));
        return encrypt.apply(this, arguments);
      }
    },
    decrypt: {
      value() {
        return decrypt.apply(this, arguments).then(data => {
          console.log('decrypted', new TextDecoder().decode(data));
          return data;
        });
      }
    }
  });
})();

// A promise based attack
(() => {
  const {then} = Promise.prototype;
  Object.defineProperties(Promise.prototype, {
    then: {
      value(fn) {
        return typeof fn === 'function' ?
          then.call(this, result => {
            console.log('busted', result);
            return fn(result);
          }) :
          then.call(this, fn, result => {
            console.log('busted', result);
            return result;
          });
      }
    }
  });
})();
```

## The Solution

Based on [safer-promise](https://github.com/WebReflection/safer-promise#safer-promise), hence on [safer-function](https://github.com/WebReflection/safer-function#safer-function), this module should be included as top-most dependency, to ensure no third parts or polyfill could've interfered with the native version of its dependencies: the `Function.prototype` and the `Promise`.

Bear in mind this module does not change in any way globals variables, classes, or prototypes, it simply secures a custom `crypto` and its `subtle` reference in a not observable way.

```js
import crypto from 'safer-crypto';
import {encode, decode} from 'safer-text';

const {log} = console;

crypto.subtle
  .digest(
    'SHA-256',
    encode('safer encryption')
  )
  .then(sha256Buffer => {
    log(sha256Buffer); // ArrayBuffer
  });

```
