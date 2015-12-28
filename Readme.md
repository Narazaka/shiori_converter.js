# [shiori_converter](https://github.com/Narazaka/shiori_converter.js)

[![npm](https://img.shields.io/npm/v/shiori_converter.svg)](https://www.npmjs.com/package/shiori_converter)
[![npm license](https://img.shields.io/npm/l/shiori_converter.svg)](https://www.npmjs.com/package/shiori_converter)
[![npm download total](https://img.shields.io/npm/dt/shiori_converter.svg)](https://www.npmjs.com/package/shiori_converter)
[![npm download by month](https://img.shields.io/npm/dm/shiori_converter.svg)](https://www.npmjs.com/package/shiori_converter)
[![Bower](https://img.shields.io/bower/v/shiori_converter.svg)](https://github.com/Narazaka/shiori_converter.js)
[![Bower](https://img.shields.io/bower/l/shiori_converter.svg)](https://github.com/Narazaka/shiori_converter.js)

[![Dependency Status](https://david-dm.org/Narazaka/shiori_converter.js.svg)](https://david-dm.org/Narazaka/shiori_converter.js)
[![devDependency Status](https://david-dm.org/Narazaka/shiori_converter.js/dev-status.svg)](https://david-dm.org/Narazaka/shiori_converter.js#info=devDependencies)
[![Build Status](https://travis-ci.org/Narazaka/shiori_converter.js.svg)](https://travis-ci.org/Narazaka/shiori_converter.js)
[![codecov.io](https://codecov.io/github/Narazaka/shiori_converter.js/coverage.svg?branch=master)](https://codecov.io/github/Narazaka/shiori_converter.js?branch=master)
[![Code Climate](https://codeclimate.com/github/Narazaka/shiori_converter.js/badges/gpa.svg)](https://codeclimate.com/github/Narazaka/shiori_converter.js)

SHIORI Protocol version converter

## Install

npm:
```
npm install shiori_converter
```

bower:
```
bower install shiori_converter
```

This module depends on [ShioriJK](https://github.com/Narazaka/shiorijk)

## Usage

node.js:
```javascript
var shiori_converter = require('shiori_converter');
var ShioriConverter = shiori_converter.ShioriConverter;
```

browser:
```html
<script src="shiorijk.js"></script>
<script src="shiori_converter.js"></script>
```

```javascript
var request3 = new ShioriJK.Message.Request({
  request_line: {
    method: 'GET',
    version: '3.0',
  },
  headers: {
    ID: 'OnBoot',
    Charset: 'UTF-8',
    Sender: 'Ikagaka',
  },
});
var request2 = ShioriConverter.request_to(request3, '2.6');
console.log(request2.toString());

var response2 = new ShioriJK.Message.Response({
  status_line: {
    code: 200,
    version: '2.6',
  },
  headers: {
    Sentence: '\\h\\s[0]\\e',
    Charset: 'UTF-8',
    Sender: 'ikaga',
  },
});
var response3 = ShioriConverter.response_to(request3, response2, '3.0');
console.log(response3.toString());
```

## API

[API Document](https://narazaka.github.io/shiori_converter.js/index.html)

## License

This is released under [MIT License](http://narazaka.net/license/MIT?2015).
