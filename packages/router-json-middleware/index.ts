import { Middleware, Body } from "@ezapi/router-core";
import mimeMatch from "mime-match";

const DEFAULT_MIME_TYPE = "application/json";

// eslint-disable-next-line @typescript-eslint/ban-types
export const JsonParserMiddlerware = <A extends {}>() =>
  Middleware.of<A, { jsonBody: object }, Body, unknown>(
    async (req, handler) => {
      const contentType = req.headers["content-type"];
      if (!mimeMatch(DEFAULT_MIME_TYPE, contentType as string)) {
        return {
          statusCode: 415,
          body: `Unsupported media type: ${contentType as string}`,
        };
      }
      let result: object = {};
      try {
        result = req.body && req.body.length ? JSON.parse(req.body.toString()) : undefined;
      } catch (e) {
        console.log(e);
        return Promise.resolve({
          statusCode: 400,
          body: "Invalid JSON",
        });
      }
      const resp = await handler({ ...req, jsonBody: result });
      return {
        statusCode: resp.statusCode,
        body: JSON.stringify(resp.body),
        headers: {
          ...resp.headers,
          "content-type": "application/json; charset=utf-8",
        },
      };
    }
  );
