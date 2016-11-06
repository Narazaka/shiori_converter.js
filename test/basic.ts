/// <reference types="mocha" />
import * as assert from "power-assert";
import * as ShioriJK from "shiorijk";
import {ShioriConverter} from "../src/lib/shiori_converter";

const transactions: {
  [event: string]: {
    cannot3to2?: boolean,
    cannot2to3?: boolean,
    type?: "communicate" | "teach" | "translate" | "otherghostname",
    [version: number]: {
      request: ShioriJK.Message.Request | string,
      response: ShioriJK.Message.Response,
    }
  }
} = {
  "GET Sentence": {
    3: {
      request: new ShioriJK.Message.Request({
        request_line: {
          method:  "GET",
          version: "3.0",
        },
        headers: {
          Charset:    "Shift_JIS",
          Sender:     "dummy-baseware",
          ID:         "OnSecondChange",
          Reference0: "1",
          Reference1: "0",
          Reference2: "0",
          Reference3: "0",
        },
      }),
      response: new ShioriJK.Message.Response({
        status_line: {
          code:    200,
          version: "3.0",
        },
        headers: {
          Charset: "Shift_JIS",
          Sender:  "dummy-ghost",
          Value:   "\\h\\s[0]\\e",
        },
      }),
    },
    2: {
      request: new ShioriJK.Message.Request({
        request_line: {
          method:  "GET Sentence",
          version: "2.6",
        },
        headers: {
          Charset:    "Shift_JIS",
          Sender:     "dummy-baseware",
          Event:      "OnSecondChange",
          Reference0: "1",
          Reference1: "0",
          Reference2: "0",
          Reference3: "0",
        },
      }),
      response: new ShioriJK.Message.Response({
        status_line: {
          code:    200,
          version: "2.6",
        },
        headers: {
          Charset:  "Shift_JIS",
          Sender:   "dummy-ghost",
          Sentence: "\\h\\s[0]\\e",
        },
      }),
    },
  },
  "OnCommunicate": { // TODO
    type: "communicate",
    3: {
      request: new ShioriJK.Message.Request({
        request_line: {
          method:  "GET",
          version: "3.0",
        },
        headers: {
          Charset: "Shift_JIS",
          Sender:  "dummy-baseware",
          ID:      "OnCommunicate",
          Reference0: "other-ghost1",
          Reference1: "\\h\\s[0]hi\\e",
          Reference2: "ECHO/1.0",
          Reference3: "\\h\\s[0]ho\\e",
        },
      }),
      response: new ShioriJK.Message.Response({
        status_line: {
          code:    200,
          version: "3.0",
        },
        headers: {
          Charset: "Shift_JIS",
          Sender:  "dummy-ghost",
          Value:   "\\h\\s[0]ho\\e",
          Reference0: "other-ghost",
          Reference1: "ECHO/1.0",
          Reference2: "\\h\\s[0]Sail on the night!\\e",
        },
      }),
    },
    2: {
      request: new ShioriJK.Message.Request({
        request_line: {
          method:  "GET Sentence",
          version: "2.6",
        },
        headers: {
          Charset:    "Shift_JIS",
          Sender:     "other-ghost1",
          Sentence:   "\\h\\s[0]hi\\e",
          Age:        "0",
          Reference0: "ECHO/1.0",
          Reference1: "\\h\\s[0]ho\\e",
        },
      }),
      response: new ShioriJK.Message.Response({
        status_line: {
          code:    200,
          version: "2.6",
        },
        headers: {
          Charset:    "Shift_JIS",
          Sender:     "dummy-ghost",
          Sentence:   "\\h\\s[0]ho\\e",
          To:         "other-ghost",
          Age:        "1",
          Reference0: "ECHO/1.0",
          Reference1: "\\h\\s[0]Sail on the night!\\e",
        },
      }),
    },
  },
  "GET String": {
    3: {
      request: new ShioriJK.Message.Request({
        request_line: {
          method:  "GET",
          version: "3.0",
        },
        headers: {
          Charset: "Shift_JIS",
          Sender:  "dummy-baseware",
          ID:      "username",
        },
      }),
      response: new ShioriJK.Message.Response({
        status_line: {
          code:    200,
          version: "3.0",
        },
        headers: {
          Charset: "Shift_JIS",
          Sender:  "dummy-ghost",
          Value:   "master",
        },
      }),
    },
    2: {
      request: new ShioriJK.Message.Request({
        request_line: {
          method:  "GET String",
          version: "2.6",
        },
        headers: {
          Charset: "Shift_JIS",
          Sender:  "dummy-baseware",
          ID:      "username",
        },
      }),
      response: new ShioriJK.Message.Response({
        status_line: {
          code:    200,
          version: "2.6",
        },
        headers: {
          Charset:  "Shift_JIS",
          Sender:   "dummy-ghost",
          String:   "master",
        },
      }),
    },
  },
  "TEACH": {
    type: "teach",
    3: {
      request: new ShioriJK.Message.Request({
        request_line: {
          method:  "GET",
          version: "3.0",
        },
        headers: {
          Charset:    "Shift_JIS",
          Sender:     "dummy-baseware",
          ID:         "OnTeach",
          Reference0: "Ikagaka",
          Reference1: "baseware",
          Reference2: "JS",
        },
      }),
      response: new ShioriJK.Message.Response({
        status_line: {
          code:    311,
          version: "3.0",
        },
        headers: {
          Charset: "Shift_JIS",
          Sender:  "dummy-ghost",
          Value:   "\\h\\s[0]more info\\e",
        },
      }),
    },
    2: {
      request: new ShioriJK.Message.Request({
        request_line: {
          method:  "TEACH",
          version: "2.4",
        },
        headers: {
          Charset:    "Shift_JIS",
          Sender:     "dummy-baseware",
          Word:       "Ikagaka",
          Reference0: "baseware",
          Reference1: "JS",
        },
      }),
      response: new ShioriJK.Message.Response({
        status_line: {
          code:    311,
          version: "2.4",
        },
        headers: {
          Charset:  "Shift_JIS",
          Sender:   "dummy-ghost",
          Sentence: "\\h\\s[0]more info\\e",
        },
      }),
    },
  },
  "TRANSLATE Sentence": {
    type: "translate",
    3: {
      request: new ShioriJK.Message.Request({
        request_line: {
          method:  "GET",
          version: "3.0",
        },
        headers: {
          Charset:    "Shift_JIS",
          Sender:     "dummy-baseware",
          ID:         "OnTranslate",
          Reference0: "\\h\\s[0]hoge\\e",
        },
      }),
      response: new ShioriJK.Message.Response({
        status_line: {
          code:    311,
          version: "3.0",
        },
        headers: {
          Charset: "Shift_JIS",
          Sender:  "dummy-ghost",
          Value:   "\\h\\s[0]piyo\\e",
        },
      }),
    },
    2: {
      request: new ShioriJK.Message.Request({
        request_line: {
          method:  "TRANSLATE Sentence",
          version: "2.6",
        },
        headers: {
          Charset:  "Shift_JIS",
          Sender:   "dummy-baseware",
          Sentence: "\\h\\s[0]hoge\\e",
        },
      }),
      response: new ShioriJK.Message.Response({
        status_line: {
          code:    311,
          version: "2.6",
        },
        headers: {
          Charset:  "Shift_JIS",
          Sender:   "dummy-ghost",
          Sentence: "\\h\\s[0]piyo\\e",
        },
      }),
    },
  },
  "GET Version": {
    cannot2to3: true,
    cannot3to2: true,
    2: {
      request: new ShioriJK.Message.Request({
        request_line: {
          method:  "GET Version",
          version: "2.6",
        },
        headers: {
          Charset: "Shift_JIS",
          Sender:  "dummy-baseware",
        },
      }),
      response:  new ShioriJK.Message.Response({
        status_line: {
          code:    200,
          version: "2.6",
        },
        headers: {
          Charset:  "Shift_JIS",
          Sender:   "dummy-ghost",
          ID:       "dummy-shiori",
          Craftman: "dummy-author",
        },
      }),
    },
    3: {
      request: new ShioriJK.Message.Request({
        request_line: {
          method:  "GET",
          version: "3.0",
        },
        headers: {
          Charset: "Shift_JIS",
          Sender:  "dummy-baseware",
          ID:      "version",
        },
      }),
      response:  new ShioriJK.Message.Response({
        status_line: {
          code:    200,
          version: "3.0",
        },
        headers: {
          Charset: "Shift_JIS",
          Sender:  "dummy-ghost",
          Value:   "0.0.1",
        },
      }),
    },
  },
  "NOTIFY OwnerGhostName": {
    2: {
      request: new ShioriJK.Message.Request({
        request_line: {
          method:  "NOTIFY OwnerGhostName",
          version: "2.6",
        },
        headers: {
          Charset: "Shift_JIS",
          Sender:  "dummy-baseware",
          Ghost:   "dummy-ghost",
        },
      }),
      response:  new ShioriJK.Message.Response({
        status_line: {
          code:    204,
          version: "2.6",
        },
        headers: {
          Charset: "Shift_JIS",
          Sender:  "dummy-ghost",
        },
      }),
    },
    3: {
      request: new ShioriJK.Message.Request({
        request_line: {
          method:  "NOTIFY",
          version: "3.0",
        },
        headers: {
          Charset:    "Shift_JIS",
          Sender:     "dummy-baseware",
          ID:         "ownerghostname",
          Reference0: "dummy-ghost",
        },
      }),
      response:  new ShioriJK.Message.Response({
        status_line: {
          code:    204,
          version: "3.0",
        },
        headers: {
          Charset: "Shift_JIS",
          Sender:  "dummy-ghost",
        },
      }),
    },
  },
  "NOTIFY OtherGhostName": {
    type: "otherghostname",
    2: {
      request: `NOTIFY OtherGhostName SHIORI/2.6
                Charset: Shift_JIS
                Sender: dummy-baseware
                GhostEx: other-ghost1\x010\x0110
                GhostEx: other-ghost2\x010\x0110
                GhostEx: other-ghost3\x010\x0110

      `.replace(/  +/g, "").replace(/\r\n|\n|\r/g, "\r\n"),
      response:  new ShioriJK.Message.Response({
        status_line: {
          code:    204,
          version: "2.6",
        },
        headers: {
          Charset: "Shift_JIS",
          Sender:  "dummy-ghost",
        },
      }),
    },
    3: {
      request: new ShioriJK.Message.Request({
        request_line: {
          method:  "NOTIFY",
          version: "3.0",
        },
        headers: {
          Charset:    "Shift_JIS",
          Sender:     "dummy-baseware",
          ID:         "otherghostname",
          Reference0: "other-ghost1\x010\x0110",
          Reference1: "other-ghost2\x010\x0110",
          Reference2: "other-ghost3\x010\x0110",
        },
      }),
      response:  new ShioriJK.Message.Response({
        status_line: {
          code:    204,
          version: "3.0",
        },
        headers: {
          Charset: "Shift_JIS",
          Sender:  "dummy-ghost",
        },
      }),
    },
  },
};

describe("ShioriConverter", () => {
  describe("#request3to2", () => {
    it("can work with communicate", () => {
      for (const event of Object.keys(transactions)) {
        const transaction = transactions[event];
        if (transaction.type === "communicate") {
          const request = ShioriConverter.request3to2(<ShioriJK.Message.Request> transaction[3].request);
          assert.deepEqual(request, transaction[2].request);
        }
      }
    });
    it("can work with teach", () => {
      for (const event of Object.keys(transactions)) {
        const transaction = transactions[event];
        if (transaction.type === "teach") {
          const request = ShioriConverter.request3to2(<ShioriJK.Message.Request> transaction[3].request);
          assert.deepEqual(request, transaction[2].request);
        }
      }
    });
    it("can work with translate", () => {
      for (const event of Object.keys(transactions)) {
        const transaction = transactions[event];
        if (transaction.type === "translate") {
          const request = ShioriConverter.request3to2(<ShioriJK.Message.Request> transaction[3].request);
          assert.deepEqual(request, transaction[2].request);
        }
      }
    });
    it("can work with otherghostname", () => {
      for (const event of Object.keys(transactions)) {
        const transaction = transactions[event];
        if (transaction.type === "otherghostname") {
          const request = ShioriConverter.request3to2(<ShioriJK.Message.Request> transaction[3].request);
          assert(request === transaction[2].request);
        }
      }
    });
    it("can work with others", () => {
      for (const event of Object.keys(transactions)) {
        const transaction = transactions[event];
        if (!transaction.type && !transaction.cannot3to2) {
          const request = ShioriConverter.request3to2(<ShioriJK.Message.Request> transaction[3].request);
          assert.deepEqual(request, transaction[2].request);
        }
      }
    });
    it("can work with cannot convert events", () => {
      for (const event of Object.keys(transactions)) {
        const transaction = transactions[event];
        if (transaction.cannot3to2) {
          const request = ShioriConverter.request3to2(<ShioriJK.Message.Request> transaction[3].request);
          assert(!request);
        }
      }
    });
  });
  describe("#response2to3", () => {
    it("can work", () => {
      for (const event of Object.keys(transactions)) {
        const transaction = transactions[event];
        if (!transaction.cannot2to3) {
          const sourceRequest = typeof transaction[2].request === "string" ?
            new ShioriJK.Shiori.Request.Parser().parse(<string> transaction[2].request) :
            <ShioriJK.Message.Request> transaction[2].request;
          const response = ShioriConverter.response2to3(
            sourceRequest,
            transaction[2].response
          );
          assert.deepEqual(response, transaction[3].response);
        }
      }
    });
  });
  describe("#requestTo, #responseTo", () => {
    it("works", () => {
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
      assert.deepEqual(ShioriConverter.requestTo(request3, "2.6"), request2);
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
      assert.deepEqual(ShioriConverter.responseTo(request3, response2, "3.0"), response3);
    });
  });
});
