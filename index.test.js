const expect = require('chai').expect;
const Moolah = require('./');

describe('Moolah', () => {

  describe('Object creation', () => {
    it('returns a new moolah instance', () => {
      expect(new Moolah()).to.be.instanceOf(Moolah);
    });
    it('sets the value if passed into the constructor', () => {
      const startingValue = 100;
      const moolah = new Moolah(startingValue);
      expect(moolah.get()).to.equal(startingValue.toString());
    });
  });

  describe('Getters', () => {
    it('gets the major value', () => {
      const tests = {
        '123.456': '123',
        '123': '123',
        '0.123': '0',
      };
      Object.keys(tests).forEach((test) => {
        const result = tests[test];
        expect(new Moolah(test).get('major')).to.equal(result);
      });
    });
    it('gets the minor value', () => {
      const tests = {
        '123.456': '0.456',
        '123': '0',
        '0.123': '0.123',
      };
      Object.keys(tests).forEach((test) => {
        const result = tests[test];
        expect(new Moolah(test).get('minor')).to.equal(result);
      });
    });
    it('gets the entire value', () => {
      const tests = {
        '123.456': '123.456',
        '123': '123',
        '0.123': '0.123',
      };
      Object.keys(tests).forEach((test) => {
        const result = tests[test];
        expect(new Moolah(test).get()).to.equal(result);
      });
    });
  });

  describe('Setters', () => {
    it('Sets the entire value', () => {
      // this will return a string representation of the float passed in unformatted.
      expect(new Moolah().set('10.10').get()).to.equal('10.1');
    });
  });

  describe('Formatting', () => {
    it('should format major amounts correctly', () => {
      const amount = 1234.456;
      const tests = {
        'M': 1234,
        'MMM': 1234,
        'M,MMM': '1,234',
        // Groups of three
        ',M': '1,234', // Defaults to three
        'MMM,M': '1,234',
        // Groups on one
        'M,M': '1,2,3,4',
        // Groups of two
        'MM,M': '12,34',
        // Groups larger than the value being rendered
        'MMMMM,M': '1234',
      };
      Object.keys(tests).forEach((test) => {
        const result = tests[test];
        expect(new Moolah(amount).format(test)).to.be(result);
      });
    });

    // If m is specified, it will have that number of significant figures
    describe('Minor amounts', () => {
      it('should format to a specified significant figure count', () => {
        const amount = 123.450;
        const tests = {
          'm': '5',
          'mm': '45',
          'mmm': '450',
          'mmmm': '4500',
        };
        Object.keys(tests).forEach((test) => {
          const result = tests[test];
          expect(new Moolah(amount).format(test)).to.be(result);
        });
      });

      // Prepending the number of significant figures with a question mark will
      // only add that value if its not 0.
      it('should format to a optional significant figures', () => {
        const amount = 123.450;
        const tests = {
          '?m': '5',
          '?mm': '45',
          '?mmm': '45', // 3rd value is 0 so omitted
          '?mmmm': '45', // 4th value is null so omitted.
        };
        Object.keys(tests).forEach((test) => {
          const result = tests[test];
          expect(new Moolah(amount).format(test)).to.be(result);
        });
      });

      it('should allow all significant figures to be displayed with an *', () => {
        expect(new Moolah(0.123411231).format('m*')).to.be('123411231');
      });

      // Force a number of segnificant figures to always be shown with optional
      // extras (if non 0) up to a specific length. Useful for Cryptos.
      it('should format to a optional number of significant figures', () => {
        const amount = 1.4503;
        const tests = {
          'mm?m': '45', // Third char is 0 so it's omitted
          'mm?mm': '4503', // Third char is 0 but 4th is non 0 so added
          'mm?': '45', // Nothing after question mark makes it useless
        };
        Object.keys(tests).forEach((test) => {
          const result = tests[test];
          expect(new Moolah(amount).format(test)).to.be(result);
        });
      });
    });

    it('should pass a combination of formatting tests', () => {
      const tests = [
        [1234, '$,M.?mm', '$1,234'],
        [1234, '$,M.mm', '$1,234.00'],
        [1234, '.M,mm', '1.234,00'],
      ];
      tests.forEach(([test, format, expected]) => {
        expect(new Moolah(test).format(format)).to.be(expected);
      });
    });

    it('should allow periods and commas to be used as major, minor seperators, as well as thousand-like spacers', () => {
      const amount = 1234.567;
      const tests = {
        'M.m': '1234.5',
        'M.m': '1234,5',
        '.M,m': '1.234,5',
        '.M.m': '1.234.5',
        ',M,m': '1,234,5',
      };
      Object.keys(tests).forEach((test) => {
        const result = tests[test];
        expect(new Moolah(amount).format(test)).to.be(result);
      });
    });
  });

  describe('Parsing', () => {
    it('should be able to parse string values', () => {
      const happyUseCases = {
        123: 123, // number in, number out
        'USD$12,321.22': 12321.22, //Commas and currency
        '42312,22 zł': 42312.22, // Suffixed currency with comma deliminator
        'Ƀ76.13665948': 76.13665948, // A larger number of significant figures
        'AUS$12': 12, // No minor value
        '12.321,21€': 1232121, // inverted separators
        '-12.12': -12.12, // Negative numbers
        '-$31.12': -31.12, // Negative numbers before currency symbols
        '$-31.12': -31.12, // Negative numbers after currency symbols
      };
      const unhappyUseCases = [
        'There is no number', // Non numeric values
        '12 234 123', // Non comma or period separator,
        '--100', // double negative numbers
        // General badness
        undefined,
        null,
        [],
      ];

      Object.keys(happyUseCases).forEach((test) => {
        expect(new Moolah(test).value()).to.equal(happyUseCases[test]);
      });

      const factory = test => new Moolah(test);
      unhappyUseCases.forEach((test) => {
        expect(factory.bind(null, test)).to.throw(TypeError);
        expect(new Moolah().parse(test)).to.throw(TypeError);
      })
    })
  });

  describe('Manipulation', () => {
    it('should be able to add two amounts together', () => {
      const tests = [
        [0.1, 0.2, '0.3'], // Floating point errors in vanilla js
        [10.10, 20.20, '30.30'],
        [10.10, new Moolah(20.20), '30.30'], // Moolah instance
      ];

      tests.forEach(([a, b, result]) => {
        expect(new Moolah(a).plus(b)).to.equal(result);
      });
    });

    it('should be able to add two amounts together', () => {
      const tests = [
        [0.2, 0.1, '0.1'], // Floating point errors in vanilla js
        [20.20, 10.10, '10.10'],
        [20.20, new Moolah(10.10), '10.10'],
      ];

      tests.forEach(([a, b, result]) => {
        expect(new Moolah(a).minus(b)).to.equal(result);
      });
    });

    it('should be able to multiply two amounts together', () => {
      const tests = [
        [67.43, 100, '6743'], // Floating point errors in vanilla js
        [10, new Moolah(30), '300'],
      ];

      tests.forEach(([a, b, result]) => {
        expect(new Moolah(a).times(b)).to.equal(result);
      });
    });

    it('should be able to divide two amounts together', () => {
      const tests = [
        ['6743', 100, '67.43'], // Floating point errors in vanilla js
        [300, new Moolah(10), '300'],
      ];

      tests.forEach(([a, b, result]) => {
        expect(new Moolah(a).times(b)).to.equal(result);
      });
    });
  });

});
