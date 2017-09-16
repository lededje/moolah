const Big = require('big.js');

class Moolah {
  constructor(initialValue = 0) {
    let value = Big(initialValue);

    this.set = (val) => {
      value = Big(val)
      return this;
    };
    this.get = (type) => {
      switch(type) {
        case 'minor': return value.mod(1).toString();
        case 'major': return value.toFixed(0);
        default: return value.toString();
      }
    }
  }
}

module.exports = Moolah;
