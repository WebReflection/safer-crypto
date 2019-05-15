class SubtleCrypto {
  encrypt() {
    return Promise.resolve(this);
  }
}

const subtle = new SubtleCrypto;

class Crypto {
  getRandomValues() {
    return this;
  }
  get subtle() {
    return subtle;
  }
}

if (!global.crypto)
  global.crypto = new Crypto;

const {default: SaferPromise} = require('safer-promise');
const {default: saferCrypto} = require('../cjs');

console.assert(Object.isFrozen(saferCrypto));
console.assert(saferCrypto.getRandomValues() === crypto, 'bound crypto methods');

const saferSubtle = saferCrypto.subtle;
console.assert(Object.isFrozen(saferCrypto));

const p = saferSubtle.encrypt();
console.assert(p instanceof SaferPromise, 'subtle promises upgraded');
p.then(self => {
  console.assert(self === subtle, 'subtle methods properly wrapped');
  console.log('OK');
});
