'use strict';

if (typeof require !== 'undefined') {
  var assert = require('power-assert');
  var ShioriJK = require('shiorijk');
  const shiori_converter = require('../src/lib/shiori_converter');
  var ShioriConverter = shiori_converter.ShioriConverter;
}


describe('ShioriConverter', () => {
  it('will convert 3 <-> 2', () => {
    const request3 = new ShioriJK.Message.Request({
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
    const request2 = new ShioriJK.Message.Request({
      request_line: {
        method: 'GET Sentence',
        version: '2.6',
      },
      headers: {
        Event: 'OnBoot',
        Charset: 'UTF-8',
        Sender: 'Ikagaka',
      },
    });
    assert(
      ShioriConverter.request_to(request3, '2.6').toString()
      === request2.toString()
    );
    const response2 = new ShioriJK.Message.Response({
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
    const response3 = new ShioriJK.Message.Response({
      status_line: {
        code: 200,
        version: '3.0',
      },
      headers: {
        Value: '\\h\\s[0]\\e',
        Charset: 'UTF-8',
        Sender: 'ikaga',
      },
    });
    assert(
      ShioriConverter.response_to(request3, response2, '3.0').toString()
      === response3.toString()
    );
  });
});
