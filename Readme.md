# [shiori_converter.js](https://github.com/Narazaka/shiori_converter.js)

[![npm](https://img.shields.io/npm/v/shiori_converter.svg)](https://www.npmjs.com/package/shiori_converter)
[![npm license](https://img.shields.io/npm/l/shiori_converter.svg)](https://www.npmjs.com/package/shiori_converter)
[![npm download total](https://img.shields.io/npm/dt/shiori_converter.svg)](https://www.npmjs.com/package/shiori_converter)
[![npm download by month](https://img.shields.io/npm/dm/shiori_converter.svg)](https://www.npmjs.com/package/shiori_converter)

[![Dependency Status](https://david-dm.org/Narazaka/shiori_converter.js/status.svg)](https://david-dm.org/Narazaka/shiori_converter.js)
[![devDependency Status](https://david-dm.org/Narazaka/shiori_converter.js/dev-status.svg)](https://david-dm.org/Narazaka/shiori_converter.js?type=dev)
[![Travis Build Status](https://travis-ci.org/Narazaka/shiori_converter.js.svg?branch=master)](https://travis-ci.org/Narazaka/shiori_converter.js)
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/Narazaka/shiori_converter.js?svg=true&branch=master)](https://ci.appveyor.com/project/Narazaka/shiori-converter-js)
[![codecov.io](https://codecov.io/github/Narazaka/shiori_converter.js/coverage.svg?branch=master)](https://codecov.io/github/Narazaka/shiori_converter.js?branch=master)
[![Code Climate](https://codeclimate.com/github/Narazaka/shiori_converter.js/badges/gpa.svg)](https://codeclimate.com/github/Narazaka/shiori_converter.js)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3c3903c95a37410cbe9f84f3f482f764)](https://www.codacy.com/app/narazaka/shiori_converter-js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Narazaka/shiori_converter.js&amp;utm_campaign=Badge_Grade)
[![Greenkeeper badge](https://badges.greenkeeper.io/Narazaka/shiori_converter.js.svg)](https://greenkeeper.io/)

SHIORI Protocol version converter

## Install

npm:
```
npm install shiori_converter
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
