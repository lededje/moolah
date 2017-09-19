const Big = require('big.js');

const separatorRegex = ',|\.';

// Group one: required sf, group two: optional sf, group three: spread?
const minorRegex = /(,|\.)?(?=m|\?)(m+)?\??(m+)?(\*)?/;
// Group one: preceding Ms, group two, groupSeperator, following Ms
const majorRegex = /(M+)(?:(,|\.)(M+))?/;

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
        case 'major': return Math.floor(value).toString();
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

  format(formatString) {
    const subbedMajor = formatString.replace(majorRegex, this.formatMajor(formatString))
    const result = subbedMajor.replace(minorRegex, this.formatMinor(formatString))
    return result;
  }

  formatMinor(formatString) {


    if(!minorRegex.exec(formatString)) {
      return '';
    }

    const [,
      seperator = '',
      requiredSfM = '',
      optionalSfM = '',
      restSpreadOption,
    ] = minorRegex.exec(formatString);
    const requiredSf = requiredSfM.length;
    const value = Big(this.get('minor')).toString().replace('0.', '');
    const valuesSf = value === '0' ? 0 : value.length;
    const restSpread = !!restSpreadOption;
    const optionalSf = restSpread ? valuesSf : optionalSfM.length;

    // m = significant figure
    // ? = values after this if non 0 will show
    // * show all the rest of the specified chars

    let actualSf;

    if(valuesSf <= requiredSf) {
      actualSf = requiredSf;
    }

    if(valuesSf > requiredSf && valuesSf < optionalSf) {
      actualSf = valuesSf;
    }

    if(valuesSf > requiredSf + optionalSf) {
      actualSf = requiredSf + optionalSf;
    }

    const result = Big(this.get('minor')).toFixed(actualSf).replace('0.', '');

    // This block decides whether not not to trim trailing 0s
    if(result === '0') {
      return '';
    } else if(valuesSf > requiredSf + optionalSf) {
      return seperator + result.replace(/0+$/, '');
    } else {
      return seperator + result;
    }
  }

  formatMajor(formatString){
    if(!majorRegex.exec(formatString)) {
      return '';
    }

    const [,
      preceedingM = '',
      seperator,
      followingM = '',
    ] = majorRegex.exec(formatString);


    const groupCount = followingM.length;

    if(seperator) {
      return this.majorSeperator(this.get('major'), seperator, followingM.length);
    } else {
      return this.get('major');
    }
  }

  majorSeperator(str, seperator, spacing) {
    const regex = new RegExp(`.{1,${spacing}}`, 'g')
    return str.split('').reverse().join('').match(regex).join(seperator).split('').reverse().join('');
  }

  addGroupSeperator(str, seperator, nthCharacter) {
    str.reverse().match(/.{3}/g)
  }
}

module.exports = Moolah;
