import * as ShioriJK from "shiorijk";

/**
 * SHIORI/2.x/3.x/4.x Converter
 */
export class ShioriConverter {
  /**
   * convert request to specified version
   * @param {ShioriJK.Message.Request} request - request
   * @param {string} version - protocol version
   * @return {ShioriJK.Message.Request} specified version request
   */
  static requestTo(request: ShioriJK.Message.Request, version: ShioriConverter.ShioriVersion) {
    if (!request) throw new ShioriConverter.RequestNotSetError();
    if (request.request_line.version === "4.0") {
      if (version === "4.0") {
        return request;
      } else if (version === "3.0") {
        return ShioriConverter.request4to3(request);
      } else {
        return ShioriConverter.request4to2(request);
      }
    } else if (request.request_line.version === "3.0") {
      if (version === "4.0") {
        return ShioriConverter.request3to4(request);
      } else if (version === "3.0") {
        return request;
      } else {
        return ShioriConverter.request3to2(request);
      }
    } else {
      if (version === "4.0") {
        return ShioriConverter.request2to4(request);
      } else if (version === "3.0") {
        return ShioriConverter.request2to3(request);
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
  static responseTo(
    request: ShioriJK.Message.Request, response: ShioriJK.Message.Response, version: ShioriConverter.ShioriVersion
  ) {
    if (!request) throw new ShioriConverter.RequestNotSetError();
    if (!response) throw new ShioriConverter.ResponseNotSetError();
    if (response.status_line.version === "4.0") {
      if (version === "4.0") {
        return response;
      } else if (version === "3.0") {
        return ShioriConverter.response4to3(request, response);
      } else {
        return ShioriConverter.response4to2(request, response);
      }
    } else if (response.status_line.version === "3.0") {
      if (version === "4.0") {
        return ShioriConverter.response3to4(request, response);
      } else if (version === "3.0") {
        return response;
      } else {
        return ShioriConverter.response3to2(request, response);
      }
    } else {
      if (version === "4.0") {
        return ShioriConverter.response2to4(request, response);
      } else if (version === "3.0") {
        return ShioriConverter.response2to3(request, response);
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
  static request4to3(request: ShioriJK.Message.Request): ShioriJK.Message.Request {
    throw new ShioriConverter.NotImplementedError();
  }

  /**
   * convert SHIORI/4.x request to SHIORI/2.x
   * @param {ShioriJK.Message.Request} request - request
   * @return {ShioriJK.Message.Request} SHIORI/2.x request
   */
  static request4to2(request: ShioriJK.Message.Request) {
    return ShioriConverter.request3to2(
      ShioriConverter.request4to3(request)
    );
  }

  /**
   * SHIORI/3.x request method to SHIORI/2.x request method
   * @param {ShioriJK.Message.Request} request - request
   * @return {string} method
   */
  static method3to2(request: ShioriJK.Message.Request): string | void {
    const id = request.headers.header["ID"];
    if (id === "version") {
      return "GET Version";
    } else if (id === "OnTeach") {
      return "TEACH";
    } else if (id === "ownerghostname") {
      return "NOTIFY OwnerGhostName";
    } else if (id === "otherghostname") {
      return "NOTIFY OtherGhostName";
    } else if (id === "OnTranslate") {
      return "TRANSLATE Sentence";
    } else if (request.request_line.method === "NOTIFY") {
      return; // No SHIORI 2.x Event
    } else if (id.match(/^[a-z]/)) {
      return "GET String"; // default SHIORI/2.5
    } else {
      return "GET Sentence"; // default SHIORI/2.2
    }
  }

  /**
   * convert SHIORI/3.x request to SHIORI/2.x
   * @param {ShioriJK.Message.Request} request - request
   * @return {ShioriJK.Message.Request} SHIORI/2.x request
   */
  static request3to2(request: ShioriJK.Message.Request): ShioriJK.Message.Request | string | void {
    /*
    SHIORI/2.x互換変換
    - GET : Sentence : OnCommunicate はGET Sentence SHIORI/2.3に変換され、ヘッダの位置が変更されます。
    - GET : TEACH : OnTeach はTEACH SHIORI/2.4に変換され、ヘッダの位置が変更されます。
    */
    const method = ShioriConverter.method3to2(request);
    if (!method) {
      return; // No SHIORI 2.x Event
    }
    const id = request.headers.header["ID"];
    const ignoreHeaders = ["ID"];
    let referenceOffset = 0;
    const headers = new ShioriJK.Headers.Request();
    const convRequest = new ShioriJK.Message.Request({
      request_line: new ShioriJK.RequestLine({
        method: method,
        protocol: request.request_line.protocol,
        version: method === "TEACH" ? "2.4" : "2.6",
      }),
      headers,
    });

    if (method === "GET Sentence" && id != null) {
      if (id === "OnCommunicate") { // SHIORI/2.3b
        headers.header["Sender"] = request.headers.header["Reference0"];
        ignoreHeaders.push("Sender");
        headers.header["Sentence"] = request.headers.header["Reference1"];
        headers.header["Age"] = request.headers.header["Age"] || "0";
        // ref0,1のためにヘッダをずらす
        referenceOffset = -2;
      } else { // SHIORI/2.2
        headers.header["Event"] = id;
      }
    } else if (method === "GET String" && id != null) { // SHIORI/2.5
      ignoreHeaders.pop(); // headers.header["ID"] = id;
    } else if (method === "TEACH") { // SHIORI/2.4
      headers.header["Word"] = request.headers.header["Reference0"];
      // ref0のためにヘッダをずらす
      referenceOffset = -1;
    } else if (method === "NOTIFY OwnerGhostName") { // SHIORI/2.0 NOTIFY
      headers.header["Ghost"] = request.headers.header["Reference0"];
      ignoreHeaders.push("Reference0");
    } else if (method === "NOTIFY OtherGhostName") { // SHIORI/2.3 NOTIFY
      const ghosts: string[] = [];
      for (const name of Object.keys(request.headers.header)) {
        const value = request.headers.header[name];
        if (name.match(/^Reference\d+$/)) {
          ghosts.push("" + value);
        } else {
          headers.header[name] = "" + value;
        }
      }
      const ghostsHeaders = ghosts
        .map((ghost) => `GhostEx: ${ghost}\r\n`)
        .join("");
      delete headers.header["ID"];
      // ShioriJK.Headersが同一名複数ヘッダに対応していないため
      return convRequest.request_line
        + "\r\n"
        + headers
        + ghostsHeaders
        + "\r\n";
    } else if (method === "TRANSLATE Sentence") { // SHIORI/2.6
      headers.header["Sentence"] = request.headers.header["Reference0"];
      // ref0のためにヘッダをずらす
      referenceOffset = -1;
    } else { // include GET Version
      return;
    }
    if (referenceOffset) {
      for (const name in request.headers.header) {
        if (ignoreHeaders.indexOf(name) !== -1) continue;
        const value = request.headers.header[name];
        const result = name.match(/^Reference(\d+)$/);
        if (result) {
          const index = Number(result[1]) + referenceOffset;
          if (index >= 0) headers.header[`Reference${index}`] = "" + value;
        } else {
          headers.header[name] = "" + value;
        }
      }
    } else {
      for (const name in request.headers.header) {
        if (ignoreHeaders.indexOf(name) !== -1) continue;
        const value = request.headers.header[name];
        headers.header[name] = "" + value;
      }
    }
    return convRequest;
  }

  /**
   * convert SHIORI/2.x request to SHIORI/3.x
   * @param {ShioriJK.Message.Request} request - request
   * @return {ShioriJK.Message.Request} SHIORI/3.x request
   */
  static request2to3(request: ShioriJK.Message.Request): ShioriJK.Message.Request {
    throw new ShioriConverter.NotImplementedError();
  }

  /**
   * convert SHIORI/3.x request to SHIORI/4.x
   * @param {ShioriJK.Message.Request} request - request
   * @return {ShioriJK.Message.Request} SHIORI/4.x request
   */
  static request3to4(request: ShioriJK.Message.Request): ShioriJK.Message.Request {
    throw new ShioriConverter.NotImplementedError();
  }

  /**
   * convert SHIORI/2.x request to SHIORI/4.x
   * @param {ShioriJK.Message.Request} request - request
   * @return {ShioriJK.Message.Request} SHIORI/4.x request
   */
  static request2to4(request: ShioriJK.Message.Request) {
    return ShioriConverter.request3to4(
      ShioriConverter.request2to3(request)
    );
  }

  /**
   * convert SHIORI/4.x response to SHIORI/3.x
   * @param {ShioriJK.Message.Request} request - request
   * @param {ShioriJK.Message.Response} response - response
   * @return {ShioriJK.Message.Response} SHIORI/3.x response
   */
  static response4to3(
    request: ShioriJK.Message.Request, response: ShioriJK.Message.Response
  ): ShioriJK.Message.Response {
    throw new ShioriConverter.NotImplementedError();
  }

  /**
   * convert SHIORI/4.x response to SHIORI/2.x
   * @param {ShioriJK.Message.Request} request - request
   * @param {ShioriJK.Message.Response} response - response
   * @return {ShioriJK.Message.Response} SHIORI/2.x response
   */
  static response4to2(request: ShioriJK.Message.Request, response: ShioriJK.Message.Response) {
    return ShioriConverter.response3to2(
      request,
      ShioriConverter.response4to3(request, response)
    );
  }

  /**
   * convert SHIORI/3.x response to SHIORI/2.x
   * @param {ShioriJK.Message.Request} request - request
   * @param {ShioriJK.Message.Response} response - response
   * @return {ShioriJK.Message.Response} SHIORI/2.x response
   */
  static response3to2(
    request: ShioriJK.Message.Request, response: ShioriJK.Message.Response
  ): ShioriJK.Message.Response {
    throw new ShioriConverter.NotImplementedError();
  }

  /**
   * convert SHIORI/2.x response to SHIORI/3.x
   * @param {ShioriJK.Message.Request} request - request
   * @param {ShioriJK.Message.Response} response - response
   * @return {ShioriJK.Message.Response} SHIORI/3.x response
   */
  static response2to3(request: ShioriJK.Message.Request, response: ShioriJK.Message.Response) {
    const convRequest = ShioriConverter.requestTo(request, "2.6");
    let valueHeaderName: ShioriConverter.Shiori2ValueHeader;
    if (convRequest instanceof ShioriJK.Message.Request) {
      switch (convRequest.request_line.method) {
        case "GET String":
          valueHeaderName = "String";
          break;
        case "GET Word":
          valueHeaderName = "Word";
          break;
        case "GET Status":
          valueHeaderName = "Status";
          break;
        default:
          valueHeaderName = "Sentence";
          break;
      }
    } else if (convRequest) { // NOTIFY OtherGhostName
      valueHeaderName = "String"; // NOTIFYなのでないはずだがとりあえず
    } else {
      valueHeaderName = "Sentence";
    }
    const headers = new ShioriJK.Headers.Response();
    if (response.headers.header[valueHeaderName] != null) {
      headers.header["Value"] = response.headers.header[valueHeaderName];
    }
    for (const name of Object.keys(response.headers.header)) {
      const value = response.headers.header[name];
      // for Communicate
      const result = name.match(/^Reference(\d+)$/);
      if (result) {
        headers.header[`Reference${result[1] + 1}`] = value;
      } else if (name === "To") {
        headers.header["Reference0"] = value;
      } else if (name !== valueHeaderName) {
        headers.header[name] = value;
      }
    }
    return new ShioriJK.Message.Response({
      status_line: new ShioriJK.StatusLine({
        code: response.status_line.code,
        protocol: response.status_line.protocol,
        version: "3.0",
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
  static response3to4(
    request: ShioriJK.Message.Request, response: ShioriJK.Message.Response
  ): ShioriJK.Message.Response {
    throw new ShioriConverter.NotImplementedError();
  }

  /**
   * convert SHIORI/2.x response to SHIORI/4.x
   * @param {ShioriJK.Message.Request} request - request
   * @param {ShioriJK.Message.Response} response - response
   * @return {ShioriJK.Message.Response} SHIORI/4.x response
   */
  static response2to4(
    request: ShioriJK.Message.Request, response: ShioriJK.Message.Response
  ): ShioriJK.Message.Response {
    return ShioriConverter.response3to4(
      request,
      ShioriConverter.response2to3(request, response)
    );
  }
}

export namespace ShioriConverter {
  /** Shiori Protocol version */
  export type ShioriVersion = "2.6" | "3.0" | "4.0";

  /** SHIORI/2.x's value header name */
  export type Shiori2ValueHeader = "String" | "Word" | "Status" | "Sentence";

  /**
   * Request not found error
   */
  export class RequestNotSetError extends Error {
  }

  /**
   * Response not found error
   */
  export class ResponseNotSetError extends Error {
  }

  /**
   * Sorry, not implemented!
   */
  export class NotImplementedError extends Error {
  }
}
