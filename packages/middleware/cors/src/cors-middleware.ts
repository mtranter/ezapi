import { HttpMiddleware } from "@ezapi/router-core";

type AllowedOriginType = string[] | string | RegExp;
export type CorsConfig = {
  allowedOrigins?: AllowedOriginType
  allowedMethods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  allowCredentials?: boolean;
  maxAge?: number;
};

const configureOriginHeader = (
  origin: string,
  originConfig: AllowedOriginType
): Record<string, string> => {
  if (typeof originConfig === "string") {
    if (originConfig === "*") {
      return {
        "access-control-allow-origin": originConfig,
      };
    } else {
      return {
        "access-control-allow-origin": originConfig,
        vary: "origin",
      };
    }
  }
  if (Array.isArray(originConfig)) {
    const isMatch = originConfig.some(
      (oc) => oc === "*" || origin.toLowerCase() === oc.toLowerCase()
    );
    return isMatch
      ? {
          "access-control-allow-origin": origin,
          vary: "origin",
        }
      : {};
  }
  if (originConfig instanceof RegExp) {
    const isMatch = originConfig.test(origin);
    return isMatch
      ? {
          "access-control-allow-origin": origin,
          vary: "origin",
        }
      : {};
  }
  return {};
};

const configureAllowedHeaders = (
  options: CorsConfig,
  reqHeaders: Record<string, string | string[] | undefined>
): Record<string, string> => {
  let allowedHeaders = options.allowedHeaders || [];
  const headers: Record<string, string> = {};

  if (!allowedHeaders.length) {
    const requestedAllowedHeaders =
      reqHeaders["access-control-request-headers"];
    allowedHeaders = requestedAllowedHeaders
      ? Array.isArray(requestedAllowedHeaders)
        ? requestedAllowedHeaders
        : [requestedAllowedHeaders]
      : [];
    headers["vary"] = "access-control-request-headers";
  }

  if (allowedHeaders && allowedHeaders.length) {
    headers["access-control-allow-headers"] = allowedHeaders.join(",");
  }

  return headers;
};

export const CorsMiddleware = <A>(config: CorsConfig) =>
  HttpMiddleware.from<{}, {}, A, A>((handler) => async (req) => {
    const origin = (req.headers.origin || req.headers.Origin) as string;
    if (!origin) {
      return handler(req);
    }

    const responseHeaders =
      req.method === "OPTIONS"
        ? {
            ...configureOriginHeader(origin, config.allowedOrigins || "*"),
            ...configureAllowedHeaders(config, req.headers),
            "access-control-allow-methods": config.allowedMethods?.join(",") || "*",
            "access-control-expose-headers": config.exposedHeaders?.join(",") || "*",
            "access-control-allow-credentials":
              config.allowCredentials?.toString() || "false",
            "access-control-max-age": config.maxAge?.toString() || "3600",
          }
        : {
            ...configureOriginHeader(origin, config.allowedOrigins || "*"),
            "access-control-expose-headers": config.exposedHeaders?.join(",") || "*",
            "access-control-allow-credentials":
              config.allowCredentials?.toString() || "false",
          };
    const resp = await handler(req);
    return {
      ...resp,
      headers: {
        ...resp.headers,
        ...responseHeaders,
      },
    };
  });
