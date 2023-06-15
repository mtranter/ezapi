import { BackendUtils } from "./backend";
import { Middleware } from "./middleware";
import {
  Handler,
  Body,
  Response,
  Prettify,
  Request,
  RequestParams,
  ApiHandler,
} from "./types";

type ReadonlyHttpMethods = "GET" | "OPTIONS" | "HEAD";
export type HttpMethod =
  | ReadonlyHttpMethods
  | "POST"
  | "PUT"
  | "DELETE"
  | "ANY";

export type RouteDefinition = {
  method: HttpMethod;
  pathPattern: string;
  name: string;
  middleware?: Middleware<
    Request<any>,
    Request<any>,
    Response<any>,
    Response<any>
  >;
};

export type Router = {
  definitions: () => ReadonlyArray<RouteDefinition>;
  handlers: () => { [k: string]: Handler<Request<any>, Response<any>> };
  compose: (other: Router) => Router;
  run: ApiHandler;
};

const Router = (
  definitions: RouteDefinition[],
  handlers: { [k: string]: Handler<Request<any>, Response<any>> }
): Router => ({
  definitions: () => definitions,
  handlers: () => handlers,
  compose: (other) =>
    Router([...definitions, ...other.definitions()], {
      ...handlers,
      ...other.handlers(),
    }),
  run: BackendUtils.buildHandler({ definitions, handlers }),
});

export type HandlersOf<R> = R extends RouteBuilder<infer _, infer __, infer H>
  ? H
  : never;

export type RouteBuilder<A, R1 = Body, Handlers = {}> = {
  build: (handers: Handlers) => Router;
  withMiddleware: <B, R2>(
    m: Middleware<Request<A>, Request<B>, Response<R1>, Response<R2>>
  ) => RouteBuilder<Prettify<A & B>, R2>;
  route: <N extends string, Url extends string, B = {}, R2 = R1>(
    name: N,
    method: HttpMethod,
    url: Url,
    middleware?: Middleware<Request<A>, Request<B>, Response<R1>, Response<R2>>
  ) => RouteBuilder<
    A,
    R1,
    Prettify<
      Handlers & {
        [K in N]: Handler<
          Request<Prettify<A & B & RequestParams<Url>>>,
          Response<R2>
        >;
      }
    >
  >;
};

const _RouteBuilder = <
  A extends RequestParams<string>,
  B extends RequestParams<string> = A,
  R1 = Body,
  R2 = R1
>(
  definitions: RouteDefinition[],
  scopedMiddleware?: Middleware<
    Request<A>,
    Request<B>,
    Response<R1>,
    Response<R2>
  >
): RouteBuilder<B, R2> => {
  return {
    build: (handlers) => Router(definitions, handlers),
    withMiddleware: <BB, R3>(
      mw: Middleware<Request<B>, Request<BB>, Response<R2>, Response<R3>>
    ) => {
      const next = scopedMiddleware ? scopedMiddleware.andThen(mw) : mw;
      return _RouteBuilder(definitions, next as any) as RouteBuilder<
        Prettify<B & BB>,
        R3
      >;
    },
    route: (name, method, url, mw) =>
      _RouteBuilder(
        [
          ...definitions,
          {
            method,
            pathPattern: url,
            name,
            middleware: scopedMiddleware
              ? mw
                ? scopedMiddleware.andThen(mw)
                : scopedMiddleware
              : mw,
          },
        ],
        scopedMiddleware
      ),
  };
};

export const RouteBuilder = _RouteBuilder([]);

const stripForwardSlash = (prefix: string): string => {
  if (prefix.startsWith("/")) {
    return prefix.slice(1);
  }
  return prefix;
};
export const ApiBuilder = {
  build: (routes: { [prefix: string]: Router }): Router => {
    const definitions = Object.keys(routes).flatMap((prefix) => {
      const router = routes[prefix];
      return router.definitions().map((def) => ({
        ...def,
        name: `${stripForwardSlash(prefix)}.${def.name}`,
        pathPattern: `${prefix}${def.pathPattern}`,
      }));
    });
    const handlers = Object.keys(routes).reduce((acc, prefix) => {
      const router = routes[prefix];
      const handlers = Object.keys(router.handlers()).reduce((acc, name) => {
        const handler = router.handlers()[name];
        const prefixedName = `${stripForwardSlash(prefix)}.${name}`;
        return {
          ...acc,
          [prefixedName]: handler,
        };
      }, {});
      return {
        ...acc,
        ...handlers,
      };
    }, {});
    return Router(definitions, handlers);
  },
};
