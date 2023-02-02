import { BackendUtils } from "./backend";

describe("BackendUtils", () => {
  describe("urlParser", () => {
    it("should parse url", () => {
      const parser = BackendUtils.urlParser();
      const result = parser.parseUrl("/foo/{bar}", "/foo/123");
      expect(result.isMatch).toBe(true);
      expect((result.groups as any).bar).toBe("123");
    });
    it("should reject non greedy patern", () => {
      const dummyUuid = "12345678-1234-1234-1234-123456789012";
      const parser = BackendUtils.urlParser();
      const result = parser.parseUrl(
        "/courses/{id}",
        `/courses/create/status/52d8c767-e281-4a27-bbc5-7cdf91a76672`
      );
      expect(result.isMatch).toBe(false);
      //   expect((result.groups as any).id).toBe(dummyUuid);
    });
    it("should parse url with greedy param", () => {
      const dummyUuid = "12345678-1234-1234-1234-123456789012";
      const parser = BackendUtils.urlParser();
      const result = parser.parseUrl(
        "/courses/{id+}",
        `/courses/create/status/${dummyUuid}`
      );
      expect(result.isMatch).toBe(true);
      expect((result.groups as any).id).toBe(`create/status/${dummyUuid}`);
    });

    it("should parse url with normal and greedy param", () => {
      const dummyUuid = "12345678-1234-1234-1234-123456789012";
      const parser = BackendUtils.urlParser();
      const result = parser.parseUrl(
        "/courses/{action}/status/{id+}",
        `/courses/create/status/${dummyUuid}/my-id`
      );
      expect(result.isMatch).toBe(true);
      expect((result.groups as any).id).toBe(`${dummyUuid}/my-id`);
      expect((result.groups as any).action).toBe(`create`);
    });
  });
});
