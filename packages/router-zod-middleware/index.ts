import { SafeParseReturnType, ZodError, ZodType } from "zod";
import { Middleware } from "@ezapi/router-core";

export const ZodMiddleware = <A, R = unknown>(
  bodyType: ZodType<A>,
  returnType?: ZodType<R>,
  errorTransform?: (err: ZodError<A>) => unknown
) =>
  // eslint-disable-next-line @typescript-eslint/ban-types
  Middleware.of<{ jsonBody: {} }, { safeBody: A }, unknown, R>(
    async (req, handler) => {
      const parseResult = bodyType.safeParse(req.jsonBody);
      if (parseResult.success) {
        const res = await handler({ ...req, safeBody: parseResult.data });
        const success = returnType?.safeParse(res.body).success ?? true;
        return {
          statusCode: success ? 200 : 500,
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

export const ZodFallThroughMiddleware = <A>(z: ZodType<A>) =>
  Middleware.of<
    { jsonBody: unknown },
    { parsedBody: SafeParseReturnType<A, A> }
  >((req, handler) => {
    const parseResult = z.safeParse(req.body);
    return handler({ ...req, parsedBody: parseResult });
  });
