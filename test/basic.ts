/// <reference types="mocha" />
import * as assert from "power-assert";
import * as ShioriJK from "shiorijk";
import {ShioriConverter} from "../src/lib/shiori_converter";

describe("ShioriConverter", () => {
  it("will convert 3 <-> 2", () => {
    const request3 = new ShioriJK.Message.Request({
      request_line: {
        method:  "GET",
        version: "3.0",
      },
      headers: {
        ID:      "OnBoot",
        Charset: "UTF-8",
        Sender:  "Ikagaka",
      },
    });
    const request2 = new ShioriJK.Message.Request({
      request_line: {
        method:  "GET Sentence",
        version: "2.6",
      },
      headers: {
        Event:   "OnBoot",
        Charset: "UTF-8",
        Sender:  "Ikagaka",
      },
    });
    assert(
      (<ShioriJK.Message.Request> ShioriConverter.request_to(request3, "2.6")).toString()
      === request2.toString()
    );
    const response2 = new ShioriJK.Message.Response({
      status_line: {
        code:    200,
        version: "2.6",
      },
      headers: {
        Sentence: "\\h\\s[0]\\e",
        Charset:  "UTF-8",
        Sender:   "ikaga",
      },
    });
    const response3 = new ShioriJK.Message.Response({
      status_line: {
        code:    200,
        version: "3.0",
      },
      headers: {
        Value:   "\\h\\s[0]\\e",
        Charset: "UTF-8",
        Sender:  "ikaga",
      },
    });
    assert(
      ShioriConverter.response_to(request3, response2, "3.0").toString()
      === response3.toString()
    );
  });
});
