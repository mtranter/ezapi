import { HttpMiddleware, Middleware, NullMiddleware } from "./middleware";
import {
  Handler,
  Body,
  Response,
  Prettify,
  Request,
  RequestParams,
} from "./types";

type ReadonlyHttpMethods = "GET" | "OPTIONS" | "HEAD";
export type HttpMethod =
  | ReadonlyHttpMethods
  | "POST"
  | "PUT"
  | "DELETE"
  | "ANY";

export type HandlerDefinition = {
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
  definitions: () => ReadonlyArray<HandlerDefinition>;
  handlers: () => { [k: string]: Handler<Request<any>, Response<any>> };
  compose: (other: Router) => Router;
};

const Router = (
  definitions: HandlerDefinition[],
  handlers: { [k: string]: Handler<Request<any>, Response<any>> }
): Router => ({
  definitions: () => definitions,
  handlers: () => handlers,
  compose: (other) =>
    Router([...definitions, ...other.definitions()], {
      ...handlers,
      ...other.handlers(),
    }),
});

export type HandlersOf<R> = R extends RouteBuilder<infer _, infer __, infer H> ? H : never;
export type RouteBuilder<
  A extends RequestParams<string>,
  R1 = Body,
  Handlers = {}
> = {
  build: (handers: Handlers) => Router;
  withMiddleware: <B, R2>(
    m: Middleware<Request<A>, Request<B>, Response<R1>, Response<R2>>
  ) => RouteBuilder<Prettify<A & B>, R2>;
  route: <N extends string, Url extends string, B = A, R2 = R1>(
    name: N,
    method: HttpMethod,
    url: Url,
    middleware?: Middleware<Request<A>, Request<B>, Response<R1>, Response<R2>>
  ) => RouteBuilder<
    A,
    R1,
    Prettify<Handlers & { [K in N]: Handler<Request<Prettify<RequestParams<Url> & B>>, Response<R2>> }>
  >;
};

const _RouteBuilder = <
  A extends RequestParams<string>,
  B extends RequestParams<string> = A,
  R1 = Body,
  R2 = R1
>(
  definitions: HandlerDefinition[],
  globalMiddleware?: Middleware<
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
      const next = globalMiddleware ? globalMiddleware.andThen(mw) : mw;
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
            middleware: globalMiddleware
              ? mw
                ? globalMiddleware.andThen(mw)
                : globalMiddleware
              : mw,
          },
        ],
        globalMiddleware
      ),
  };
};

export const RouteBuilder = _RouteBuilder([]);
