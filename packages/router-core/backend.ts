import { ParamParser, ParamParsers } from "./param-parser";
import { isQsError, parseQuery } from "./query-parser";
import { HandlerDefinition, HttpMethod, Router } from "./router-builder";
import { Request, RequestParams, Response } from "./types";

const sizeOf = (o?: unknown) => (o ? Object.keys(o).length : 0);

const urlRegex = /\{((\w+)\+?(:\w+)?)\}(.)?/g;

const pathPatternToRegex = (pattern: string) =>
  new RegExp(
    "^" +
      pattern
        .replace(urlRegex, "(?<$2>[^\\$4]+)$4")
        .replace("[^\\]", pattern.endsWith("+}") ? "[^\\b]" : "[^\\b/]") +
      "$"
  );

export const BackendUtils = {
  buildHandler:
    (router: Router) =>
    async ({
      method,
      url,
      headers,
      body,
      query,
    }: Pick<
      Request<RequestParams<string>>,
      "body" | "headers" | "method" | "url"
    > & {
      query: Record<string, string | undefined>;
    }): Promise<Response | undefined> => {
      const urlParser = BackendUtils.urlParser();
      const requestAndDefinition = router.definitions().reduce(
        (p, def) => {
          if (!(def.method == "ANY" || def.method == method.toUpperCase())) {
            return p;
          }
          const pathParams = urlParser.parseUrl(
            def.pathPattern.split("?")[0],
            url.split("?")[0]
          );
          if (!pathParams.isMatch) {
            return p;
          }
          const queryPattern = def.pathPattern.split("?")[1];
          const parsedQuery = queryPattern
            ? parseQuery(queryPattern, query)
            : query;

          if (isQsError(parsedQuery)) {
            return p;
          }
          if (sizeOf(pathParams.groups) >= sizeOf(p[0]?.pathParams)) {
            const retval: Request<RequestParams<string>> = {
              method: method.toUpperCase() as HttpMethod,
              // eslint-disable-next-line @typescript-eslint/ban-types
              pathParams: pathParams.groups as {},
              queryParams: parsedQuery as never,
              headers,
              body:
                typeof body === "string" || body instanceof Buffer
                  ? body
                  : undefined,
              url,
            };
            return [retval, def] as [
              Request<RequestParams<string>> | undefined,
              HandlerDefinition | undefined
            ];
          }
          return p;
        },
        [undefined, undefined] as [
          Request<RequestParams<string>> | undefined,
          HandlerDefinition | undefined
        ]
      );
      if (requestAndDefinition) {
        const handlerName = requestAndDefinition[1]?.name;
        if (!handlerName) {
          return;
        }
        const handler = router.handlers()[handlerName];
        if (!handler) {
          return {
            statusCode: 500,
            body: "No handler found",
          };
        }

        const response = await handler(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          requestAndDefinition[0]!
        );
        return response;
      } else {
        return;
      }
    },
  urlParser: () => {
    const cache: Record<string, RegExp> = {};
    return {
      parseUrl: (pathPattern: string, url: string) => {
        const cached =
          cache[pathPattern] ??
          (cache[pathPattern] = pathPatternToRegex(pathPattern));
        const matchResult = cached.exec(url);
        const groups = matchResult?.groups;
        const parser = new ParamParsers();
        return !matchResult
          ? { isMatch: false, groups: [] }
          : Object.keys(groups || {}).reduce(
              (prev, k) => {
                const paramRegex = new RegExp(`\\{${k}\\+?(:(\\w+))?\\}`);
                const match = paramRegex.exec(pathPattern);
                if (match) {
                  if (match[2]) {
                    const type = match[2];
                    const parseFn = (
                      parser as unknown as Record<string, ParamParser<unknown>>
                    )[type] as ParamParser<unknown>;
                    if (!parseFn) {
                      console.log(
                        `Invalid parse type specified in path param. Url: ${pathPattern}. Type: ${type}`
                      );
                      return { isMatch: false, groups: {} };
                    }
                    const parsed = parseFn.parse((groups || {})[k]);
                    if (parsed.isRight) {
                      return {
                        ...prev,
                        groups: { ...prev.groups, [k]: parsed.value },
                      };
                    }
                  } else {
                    return {
                      ...prev,
                      groups: { ...prev.groups, [k]: (groups || {})[k] },
                    };
                  }
                }
                return { isMatch: false, groups: {} };
              },
              { isMatch: !!matchResult, groups: {} }
            );
      },
    };
  },
};
