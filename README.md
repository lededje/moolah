[![CircleCI](https://circleci.com/gh/lededje/moolah/tree/master.svg?style=svg&circle-token=3cd011d662feecbb326ef2df8a12c3deb00e3cb3)](https://circleci.com/gh/lededje/moolah/tree/master)
[![Code Climate](https://codeclimate.com/github/lededje/moolah/badges/gpa.svg)](https://codeclimate.com/github/lededje/moolah)

# Moolah

## Installation

```sh
npm install moolahjs
```

```js
const Moolah = require('moolahjs');

const money = new Moolah(123.45);
```

## Formatting

||Token|Output|
|-|-|-|-|
|Minor Currency|m[...m]|The minor currency with a fixed number of significant figures.|
||m?m|The minor currency with both fixed an optional significant figures.
||m*|The minor currency with the amount of significant figures it was defined with
||M.?m*|Adds the period and minor currency if the the minor currency isn't 0
|Major Currency|M|Displays all major figures
||M,[...M]| Splits the major currency every N characters from right to left where N is the M on the right of the deliminator.
||M.M| Uses a period instead of a comma when splitting numbers
||M,m| Uses a comma to deliminate between major and minor currencies.
|Currency Symbols|$M.m|Other characters are automatically escaped

## Examples

|Input|Format String|Output| Notes
|-|-|-|-|
|123.456|M.mm|123.46|Display all major significant figures and only two minor figures using a period as deliminator.
|1234567.12|M,MMM|1,234,567|Displays major currency split every three characters from right to left with a comma.
|45.8575449<br>86.8<br>29|฿M.mm?mm|฿86.8575<br>฿86.80<br>฿29.00|Display all major currencies, require two and allow an additional two optional significant figures.
