import { Middleware, NullMiddleware } from "./middleware";
import { Handler, Body } from "./types";

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
  handler: Handler<string, {}, Body>;
};

export type Router = {
  definitions: () => ReadonlyArray<HandlerDefinition>;
  compose: (other: Router) => Router;
};

export type RouteBuilder<A extends {} = {}, R1 = Body> = {
  build: () => Router;
  withMiddleware: <B extends {}, R2>(
    m: Middleware<A, B, R1, R2>
  ) => RouteBuilder<A & B, R2>;
  route: <Url extends string, B extends {} = A, R2 = R1>(
    method: HttpMethod,
    url: Url,
    middleware?: Middleware<A, B, R1, R2>
  ) => DefineHandler<Url, A & B, R2, A, R1>;
};

type DefineHandler<Url extends string, A extends {}, R1, AP extends {}, RP> = {
  handle: (h: Handler<Url, A, R1>) => RouteBuilder<AP, RP>;
};

const DefineHandler = <Url extends string, A extends {}, R, AP extends {}, RP>(
  method: HttpMethod,
  url: Url,
  globalMiddleware: Middleware<AP, A, Body, RP>,
  middleware: Middleware<A, AP, RP, R>,
  definitions: HandlerDefinition[]
): DefineHandler<Url, A, R, AP, RP> => {
  return {
    handle: (h) => {
      const handler = globalMiddleware.andThen(middleware)(h);
      const def: HandlerDefinition = {
        method,
        pathPattern: url,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: handler as unknown as Handler<any, any>,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return _RouteBuilder([...definitions, def], globalMiddleware) as any;
    },
  };
};

const Router = (definitions: HandlerDefinition[]): Router => ({
  definitions: () => definitions,
  compose: (other) => Router([...definitions, ...other.definitions()]),
});

const _RouteBuilder = <A extends {}, B extends {} = A, R1 = Body, R2 = R1>(
  definitions: HandlerDefinition[],
  globalMiddleware: Middleware<A, B, R1, R2>
): RouteBuilder<B, R2> => {
  return {
    build: () => Router(definitions),
    withMiddleware: <BB extends {}, R3>(mw: Middleware<B, BB, R2, R3>) => {
      const next = globalMiddleware.andThen(mw);
      return _RouteBuilder(definitions, next);
    },
    route: (method, url, mw) =>
      DefineHandler(
        method,
        url,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        globalMiddleware as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mw || NullMiddleware<A, R1>()) as any,
        definitions
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as any,
  };
};

export const RouteBuilder = _RouteBuilder([], NullMiddleware());

// const JsonParserMiddlerware = Middleware.of<any, { jsonBody: object }>((req, handler) => {
//   let result: object = {};
//   try {
//     result = JSON.parse(req.body.toString());
//   } catch {
//     return Promise.resolve({
//       statusCode: 400,
//       body: "Invalid JSON",
//     });
//   }
//   return handler({ ...req, jsonBody: result });
// });
// const router = Router;
// router
//   .route("POST", "/people/{id:int}")
//   .withMiddleware(JsonParserMiddlerware)
//   .handle((r) => r.jsonBody)
//   .route("GET", "/people/name/{name}")
//   .handle((p) => p.pathParams.name);
