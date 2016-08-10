'use strict';

if (typeof require !== 'undefined') {
  var ShioriJK = require('shiorijk');
}

/**
 * SHIORI/2.x/3.x/4.x Converter
 */
class ShioriConverter {
  /**
   * convert request to specified version
   * @param {ShioriJK.Message.Request} request - request
   * @param {string} version - protocol version
   * @return {ShioriJK.Message.Request} specified version request
   */
  static request_to(request, version) {
    if (!request) throw new ShioriConverter.RequestNotSetError();
    if (request.request_line.version === '4.0') {
      if (version === '4.0') {
        return request;
      } else if (version === '3.0') {
        return ShioriConverter.request_4to3(request);
      } else {
        return ShioriConverter.request_4to2(request);
      }
    } else if (request.request_line.version === '3.0') {
      if (version === '4.0') {
        return ShioriConverter.request_3to4(request);
      } else if (version === '3.0') {
        return request;
      } else {
        return ShioriConverter.request_3to2(request);
      }
    } else {
      if (version === '4.0') {
        return ShioriConverter.request_2to4(request);
      } else if (version === '3.0') {
        return ShioriConverter.request_2to3(request);
      } else {
        return request;
      }
    }
  }

  /**
   * convert response to specified version
   * @param {ShioriJK.Message.Request} request - request
   * @param {ShioriJK.Message.Response} response - response
   * @param {string} version - protocol version
   * @return {ShioriJK.Message.Response} specified version response
   */
  static response_to(request, response, version) {
    if (!request) throw new ShioriConverter.RequestNotSetError();
    if (!response) throw new ShioriConverter.ResponseNotSetError();
    if (response.status_line.version === '4.0') {
      if (version === '4.0') {
        return response;
      } else if (version === '3.0') {
        return ShioriConverter.response_4to3(request, response);
      } else {
        return ShioriConverter.response_4to2(request, response);
      }
    } else if (response.status_line.version === '3.0') {
      if (version === '4.0') {
        return ShioriConverter.response_3to4(request, response);
      } else if (version === '3.0') {
        return response;
      } else {
        return ShioriConverter.response_3to2(request, response);
      }
    } else {
      if (version === '4.0') {
        return ShioriConverter.response_2to4(request, response);
      } else if (version === '3.0') {
        return ShioriConverter.response_2to3(request, response);
      } else {
        return response;
      }
    }
  }

  /**
   * convert SHIORI/4.x request to SHIORI/3.x
   * @param {ShioriJK.Message.Request} request - request
   * @return {ShioriJK.Message.Request} SHIORI/3.x request
   */
  static request_4to3(request) {
    throw new ShioriConverter.NotImplementedError();
  }

  /**
   * convert SHIORI/4.x request to SHIORI/2.x
   * @param {ShioriJK.Message.Request} request - request
   * @return {ShioriJK.Message.Request} SHIORI/2.x request
   */
  static request_4to2(request) {
    return ShioriConverter.request_3to2(
      ShioriConverter.request_4to3(request)
    );
  }

  /**
   * SHIORI/3.x request method to SHIORI/2.x request method
   * @param {ShioriJK.Message.Request} request - request
   * @return {string} method
   */
  static method3to2(request) {
    const id = request.headers.header.ID;
    if (id === 'version') {
      return 'GET Version';
    } else if (id === 'OnTeach') {
      return 'TEACH';
    } else if (id === 'ownerghostname') {
      return 'NOTIFY OwnerGhostName';
    } else if (id === 'otherghostname') {
      return 'NOTIFY OtherGhostName';
    } else if (request.request_line.method === 'NOTIFY') {
      return; // No SHIORI 2.x Event
    } else if (id.match(/^[a-z]/)) {
      return 'GET String'; // default SHIORI/2.5
    } else {
      return 'GET Sentence'; // default SHIORI/2.2
    }
  }

  /**
   * convert SHIORI/3.x request to SHIORI/2.x
   * @param {ShioriJK.Message.Request} request - request
   * @return {ShioriJK.Message.Request} SHIORI/2.x request
   */
  static request_3to2(request) {
    /*
    SHIORI/2.x互換変換
    - GET : Sentence : OnCommunicate はGET Sentence SHIORI/2.3に変換され、ヘッダの位置が変更されます。
    - GET : TEACH : OnTeach はTEACH SHIORI/2.4に変換され、ヘッダの位置が変更されます。
    */
    const method = ShioriConverter.method3to2(request);
    if (!method) {
      return; // No SHIORI 2.x Event
    }
    const id = request.headers.header.ID;

    const headers = new ShioriJK.Headers.Request();
    const conv_request = new ShioriJK.Message.Request({
      request_line: new ShioriJK.RequestLine({
        method: method,
        protocol: request.protocol,
        version: '2.6',
      }),
      headers: headers,
    });

    if (method === 'GET Version') {
      // do nothing
    } else if (method === 'GET Sentence' && id != null) {
      if (id === 'OnCommunicate') { // SHIORI/2.3b
        headers.header['Sender'] = request.headers.header['Reference0'];
        headers.header['Sentence'] = request.headers.header['Reference1'];
        headers.header['Age'] = request.headers.header.Age || '0';
        // ref0,1のためにヘッダをずらす
        for (const name in request.headers.header) {
          const value = request.headers.header[name];
          let result;
          if (result = name.match(/^Reference(\d+)$/)) {
            headers.header['Reference' + (result[1] - 2)] = '' + value;
          } else {
            headers.header[name] = '' + value;
          }
        }
        return conv_request;
      } else { // SHIORI/2.2
        headers.header['Event'] = id;
      }
    } else if (method === 'GET String' && id != null) { // SHIORI/2.5
      headers.header['ID'] = id;
    } else if (method === 'TEACH') { // SHIORI/2.4
      headers.header['Word'] = request.headers.header['Reference0'];
      // ref0のためにヘッダをずらす
      for (const name in request.headers.header) {
        const value = request.headers.header[name];
        let result;
        if (result = name.match(/^Reference(\d+)$/)) {
          headers.header['Reference' + (result[1] - 1)] = '' + value;
        } else {
          headers.header[name] = '' + value;
        }
      }
      return conv_request;
    } else if (method === 'NOTIFY OwnerGhostName') { // SHIORI/2.0 NOTIFY
      headers.header['Ghost'] = request.headers.header['Reference0'];
      return conv_request;
    } else if (method === 'NOTIFY OtherGhostName') { // SHIORI/2.3 NOTIFY
      const ghosts = [];
      for (const name in request.headers.header) {
        const value = request.headers.header[name];
        if (name.match(/^Reference\d+$/)) {
          ghosts.push('' + value);
        } else {
          headers.header[name] = '' + value;
        }
      }
      const ghosts_headers = ghosts
        .map((ghost) => `GhostEx: ${ghost}\r\n`)
        .join('');
      // ShioriJK.Headersが同一名複数ヘッダに対応していないため
      return conv_request.request_line
        + '\r\n'
        + conv_request.headers
        + ghosts_headers
        + '\r\n';
    } else {
      return;
    }
    for (const name in request.headers.header) {
      if (name === 'ID') continue;
      const value = request.headers.header[name];
      headers.header[name] = '' + value;
    }
    return conv_request;
  }

  /**
   * convert SHIORI/2.x request to SHIORI/3.x
   * @param {ShioriJK.Message.Request} request - request
   * @return {ShioriJK.Message.Request} SHIORI/3.x request
   */
  static request_2to3(request) {
    throw new ShioriConverter.NotImplementedError();
  }

  /**
   * convert SHIORI/3.x request to SHIORI/4.x
   * @param {ShioriJK.Message.Request} request - request
   * @return {ShioriJK.Message.Request} SHIORI/4.x request
   */
  static request_3to4(request) {
    throw new ShioriConverter.NotImplementedError();
  }

  /**
   * convert SHIORI/2.x request to SHIORI/4.x
   * @param {ShioriJK.Message.Request} request - request
   * @return {ShioriJK.Message.Request} SHIORI/4.x request
   */
  static request_2to4(request) {
    return ShioriConverter.request_3to4(
      ShioriConverter.request_2to3(request)
    );
  }

  /**
   * convert SHIORI/4.x response to SHIORI/3.x
   * @param {ShioriJK.Message.Request} request - request
   * @param {ShioriJK.Message.Response} response - response
   * @return {ShioriJK.Message.Response} SHIORI/3.x response
   */
  static response_4to3(request, response) {
    throw new ShioriConverter.NotImplementedError();
  }

  /**
   * convert SHIORI/4.x response to SHIORI/2.x
   * @param {ShioriJK.Message.Request} request - request
   * @param {ShioriJK.Message.Response} response - response
   * @return {ShioriJK.Message.Response} SHIORI/2.x response
   */
  static response_4to2(request, response) {
    return ShioriConverter.response_3to2(
      ShioriConverter.response_4to3(request, response)
    );
  }

  /**
   * convert SHIORI/3.x response to SHIORI/2.x
   * @param {ShioriJK.Message.Request} request - request
   * @param {ShioriJK.Message.Response} response - response
   * @return {ShioriJK.Message.Response} SHIORI/2.x response
   */
  static response_3to2(request, response) {
    throw new ShioriConverter.NotImplementedError();
  }

  /**
   * convert SHIORI/2.x response to SHIORI/3.x
   * @param {ShioriJK.Message.Request} request - request
   * @param {ShioriJK.Message.Response} response - response
   * @return {ShioriJK.Message.Response} SHIORI/3.x response
   */
  static response_2to3(request, response) {
    const conv_request = ShioriConverter.request_to(request, '2.6');
    let value_name;
    switch (conv_request.request_line.method) {
      case 'GET String':
        value_name = 'String';
        break;
      case 'GET Word':
        value_name = 'Word';
        break;
      case 'GET Status':
        value_name = 'Status';
        break;
      default:
        value_name = 'Sentence';
        break;
    }
    const headers = new ShioriJK.Headers.Response();
    if (response.headers.header[value_name] != null) {
      headers.header.Value = response.headers.header[value_name];
    }
    for (const name in response.headers.header) {
      const value = response.headers.header[name];
      // for Communicate
      let result;
      if (result = name.match(/^Reference(\d+)$/)) {
        headers.header[`Reference${result[1] + 1}`] = value;
      } else if (name === 'To') {
        headers.header.Reference0 = value;
      } else if (name !== value_name) {
        headers.header[name] = value;
      }
    }
    return new ShioriJK.Message.Response({
      status_line: new ShioriJK.StatusLine({
        code: response.status_line.code,
        protocol: response.status_line.protocol,
        version: '3.0',
      }),
      headers: headers,
    });
  }

  /**
   * convert SHIORI/3.x response to SHIORI/4.x
   * @param {ShioriJK.Message.Request} request - request
   * @param {ShioriJK.Message.Response} response - response
   * @return {ShioriJK.Message.Response} SHIORI/4.x response
   */
  static response_3to4(request, response) {
    throw new ShioriConverter.NotImplementedError();
  }

  /**
   * convert SHIORI/2.x response to SHIORI/4.x
   * @param {ShioriJK.Message.Request} request - request
   * @param {ShioriJK.Message.Response} response - response
   * @return {ShioriJK.Message.Response} SHIORI/4.x response
   */
  static response_2to4(request, response) {
    return ShioriConverter.response_3to4(
      ShioriConverter.response_2to3(request, response)
    );
  }
}

/**
 * Request not found error
 */
ShioriConverter.RequestNotSetError = class RequestNotSetError extends Error {
};

/**
 * Response not found error
 */
ShioriConverter.ResponseNotSetError = class ResponseNotSetError extends Error {
};

/**
 * Sorry, not implemented!
 */
ShioriConverter.NotImplementedError = class NotImplementedError extends Error {
};

export {ShioriConverter};
