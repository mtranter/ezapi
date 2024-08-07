import { BackendUtils } from "./backend";
import { HttpMiddleware, Middleware, PassThrough } from "./middleware";
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

type SuperType<A, B> = B extends A ? A : never;
export type RouteBuilder<A, R1 = Body, Handlers = {}> = {
  /**
   * Builds a router from the route definitions.
   * @param handlers - The handlers to build the router from.
   * @returns A @see Router.
   * @example
   * const router = RouteBuilder
   * .route("create", "POST", "/")
   * .build({
   *  create: (req) => {
   *    const user = req.body;
   *    return Ok(JSON.stringify(user));
   *  },
   * });
   **/
  build: (handers: Handlers) => Router;
  withMiddleware: <
    RR1 extends R1 | PassThrough,
    MW extends HttpMiddleware<any, any, RR1, any>,
  >(
    m: MW
  ) => MW extends HttpMiddleware<infer AA, infer B, RR1, infer R2>
    ? A extends AA
      ? RouteBuilder<
          Prettify<AA & B>,
          R2 extends PassThrough ? R1 : R2,
          Handlers
        >
      : AA extends PassThrough
        ? RouteBuilder<
            Prettify<A & B>,
            R2 extends PassThrough ? R1 : R2,
            Handlers
          >
        : never
    : never;
  /**
   * Adds a route to the route definitions.
   * @param name - The name of the route.
   * @param method - The HTTP method of the route.
   * @param url - The URL of the route.
   * @param middleware - The middleware to run before the handler.
   * @returns A @see RouteBuilder.
   * @example
   * const router = RouteBuilder
   * .route("createUser", "POST", "/", ZodMiddleware(UserSchema))
   * .route("getUser", "GET", "/{id}")
   **/
  route: <
    N extends string,
    Url extends string,
    MW extends Middleware<
      Request<A | PassThrough>,
      any,
      Response<R1 | PassThrough>,
      any
    > = HttpMiddleware<A, A, R1, R1>,
  >(
    name: N,
    method: HttpMethod,
    url: Url,
    middleware?: MW
  ) => MW extends Middleware<any, Request<infer B>, any, Response<infer R2>>
    ? RouteBuilder<
        A,
        R1,
        Prettify<
          Handlers & {
            [K in N]: Handler<
              Request<
                Prettify<
                  A & (B extends PassThrough ? {} : B) & RequestParams<Url>
                >
              >,
              Response<R2 extends PassThrough ? R1 : R2>
            >;
          }
        >
      >
    : never;
};

const _RouteBuilder = <
  A extends RequestParams<string>,
  B extends RequestParams<string> = A,
  R1 = Body,
  R2 = R1,
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
    withMiddleware: (mw: Middleware<any, any, any, any>) => {
      const next = scopedMiddleware ? scopedMiddleware.andThen(mw) : mw;
      return _RouteBuilder(definitions, next as any) as any;
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
                ? scopedMiddleware.andThen(mw as any)
                : scopedMiddleware
              : mw,
          },
        ],
        scopedMiddleware
      ) as any,
  };
};

export const RouteBuilder = _RouteBuilder([]);

const stripForwardSlash = (prefix: string): string => {
  if (prefix.startsWith("/")) {
    return prefix.slice(1);
  }
  return prefix;
};

type SlashPrefix<S> = S extends `/${infer _}` ? S : never;
type Routes<T> = {
  [K in keyof T]: K extends SlashPrefix<K> ? T[K] : never;
};

export const ApiBuilder = {
  /**
   * Builds a router from a set of routes.
   * @param routes - The routes to build the router from.
   * @returns A @see Router.
   * @example
   * const userRoutes = RouteBuilder
   * .route("create", "POST", "/")
   * .build({
   *  create: (req) => {
   *    const user = req.body;
   *    return Ok(JSON.stringify(user));
   *  },
   * });
   * const router = ApiBuilder.build({
   *  "/users": userRoutes,
   * });
   */
  build: <T extends Record<string, Router | Router[]>>(
    routes: Routes<T>
  ): Router => {
    const { handlers, definitions } = Object.keys(routes).reduce(
      (acc, prefix) => {
        const routerOrRouters = (routes as Record<string, Router | Router[]>)[
          prefix
        ];
        const routers = Array.isArray(routerOrRouters)
          ? routerOrRouters
          : [routerOrRouters];
        const allHandlers = routers.reduce(
          (acc, r) => ({ ...acc, ...r.handlers() }),
          {} as Record<string, Handler<any, Response<any>>>
        );
        const handlers = Object.keys(allHandlers).reduce((acc, name) => {
          const handler = allHandlers[name];
          const prefixedName = `${stripForwardSlash(prefix)}.${name}`;
          return {
            ...acc,
            [prefixedName]: handler,
          };
        }, {});
        const allDefinitions = routers.flatMap((r) => r.definitions());
        const definitions = allDefinitions.map((def) => ({
          ...def,
          name: `${stripForwardSlash(prefix)}.${def.name}`,
          pathPattern: `${prefix}${def.pathPattern}`,
        }));
        return {
          definitions: [...acc.definitions, ...definitions],
          handlers: {
            ...acc.handlers,
            ...handlers,
          },
        };
      },
      {
        definitions: [] as RouteDefinition[],
        handlers: {},
      }
    );
    return Router(definitions, handlers);
  },
};
