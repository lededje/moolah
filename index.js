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

    this.add = this.plus = this.add.bind(this);
    this.minus = this.subtract = this.minus.bind(this);
    this.multiply = this.times = this.multiply.bind(this);
    this.divide = this.divide.bind(this);
  }

  add(value) {
    const currentValue = this.get();
    const addition = value instanceof Moolah ? value.get() : value;
    this.set(Big(currentValue).add(addition));
    return this;
  }

  minus(value) {
    const currentValue = this.get();
    const subtraction = value instanceof Moolah ? value.get() : value;
    this.set(Big(currentValue).minus(subtraction));
    return this;
  }

  multiply(value) {
    const currentValue = this.get();
    const multiply = value instanceof Moolah ? value.get() : value;
    this.set(Big(currentValue).times(multiply));
    return this;
  }

  divide(value) {
    const currentValue = this.get();
    const divide = value instanceof Moolah ? value.get() : value;
    this.set(Big(currentValue).div(divide));
    return this;
  }
}

module.exports = Moolah;
