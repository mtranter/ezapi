import { Forbidden, HttpMiddleware } from "@ezapi/router-core";

export type CorsConfig = {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  allowCredentials: boolean;
  maxAge: number;
};

export const CorsMiddleware = <A>(config: CorsConfig) =>
  HttpMiddleware.from<{}, {}, A, A>((handler) => async (req) => {
    const origin = req.headers.origin as string;
    if (!origin) {
      return handler(req);
    }
    if (!config.allowedOrigins.includes(origin)) {
      return Forbidden("Forbidden" as A);
    }
    const resp = await handler(req);
    return {
      ...resp,
      headers: {
        ...resp.headers,
        "access-control-allow-origin": origin,
        "access-control-allow-methods": config.allowedMethods.join(","),
        "access-control-allow-headers": config.allowedHeaders.join(","),
        "access-control-expose-headers": config.exposedHeaders.join(","),
        "access-control-allow-credentials": config.allowCredentials.toString(),
        "access-control-max-age": config.maxAge.toString(),
      },
    };
  });
