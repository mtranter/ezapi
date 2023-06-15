import { ZodError, ZodType } from "zod";
import { HttpMiddleware } from "@ezapi/router-core";

export const ZodMiddleware = <Body, R>(
  bodyType: ZodType<Body>,
  returnType?: ZodType<R>,
  errorTransform?: (err: ZodError<Body>) => unknown
) =>
  HttpMiddleware.of<{ jsonBody: unknown }, { safeBody: Body }, unknown, R>(
    async (req, handler) => {
      const parseResult = bodyType.safeParse(req.jsonBody);
      if (parseResult.success) {
        const res = await handler({ ...req, safeBody: parseResult.data });
        const success = returnType?.safeParse(res.body).success ?? true;
        return {
          ...res,
          statusCode: success ? res.statusCode : 500,
          body: success
            ? res.body
            : "Internal server error. Unexpected response",
        };
      } else {
        const transformer =
          errorTransform ?? ((a: unknown) => JSON.stringify(a));
        return Promise.resolve({
          statusCode: 400,
          body: transformer(parseResult.error),
        });
      }
    }
  );
