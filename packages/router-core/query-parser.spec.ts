import "jest";
import { isQsError, parseQuery, QueryStringParserError } from "./query-parser";

describe("Query Parser", () => {
  describe("parse query", () => {
    it("should work for simple query", () => {
      const spec = "{code}&{name}";
      const queryParser = parseQuery(spec, { code: "123", name: "Fred" });
      expect(isQsError(queryParser)).toBe(false);
      expect((queryParser as Record<string, unknown | undefined>).code).toEqual(
        "123"
      );
      expect((queryParser as Record<string, unknown | undefined>).name).toEqual(
        "Fred"
      );
    });
    it("should work for simple query with nullable params", () => {
      const spec = "{code}&{name?}";
      const queryParser = parseQuery(spec, { code: "123" });
      expect(isQsError(queryParser)).toBe(false);
      expect((queryParser as Record<string, unknown | undefined>).code).toEqual(
        "123"
      );
      expect(
        (queryParser as Record<string, unknown | undefined>).name
      ).toBeUndefined();
    });
    it("should work for simple query with typed params", () => {
      const spec = "{code:int}&{name}";
      const queryParser = parseQuery(spec, { code: "123", name: "Fred" });
      expect(isQsError(queryParser)).toBe(false);
      expect((queryParser as Record<string, unknown | undefined>).code).toBe(
        123
      );
      expect((queryParser as Record<string, unknown | undefined>).name).toEqual(
        "Fred"
      );
    });
    it("should return error for non supplied required arg", () => {
      const spec = "{code:int}&{name}";
      const queryParser = parseQuery(spec, { name: "Fred" });
      expect(isQsError(queryParser)).toBe(true);

      expect((queryParser as QueryStringParserError).faults[0]).toMatchObject({
        message: `Value Not Provided: code`,
        fieldName: "code",
        type: "ValueNotProvided",
      });
    });
    it("should return error for suppled required arg with bad format", () => {
      const spec = "{code:int}&{name}";
      const queryParser = parseQuery(spec, { code: "a fds", name: "Fred" });
      expect(isQsError(queryParser)).toBe(true);

      expect((queryParser as QueryStringParserError).faults[0]).toMatchObject({
        message: `Cannot parse 'a fds' to int for key: code`,
        fieldName: "code",
        type: "BadRequest",
      });
    });

    it("should return multiple errors", () => {
      const spec = "{code:int}&{name}";
      const queryParser = parseQuery(spec, { code: "a fds" });
      expect(isQsError(queryParser)).toBe(true);

      expect((queryParser as QueryStringParserError).faults[0]).toMatchObject({
        message: `Cannot parse 'a fds' to int for key: code`,
        fieldName: "code",
        type: "BadRequest",
      });
      expect((queryParser as QueryStringParserError).faults[1]).toMatchObject({
        message: `Value Not Provided: name`,
        fieldName: "name",
        type: "ValueNotProvided",
      });
    });
  });
});
