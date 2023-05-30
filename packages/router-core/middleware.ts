import { Body, Handler, Request, Response, Prettify } from "./types";

// eslint-disable-next-line @typescript-eslint/ban-types
type _Middleware<A extends {}, B extends {}, R1 = Body, R2 = R1> = <
  Url extends string
>(
  handler: Handler<Url, B, R2>
) => Handler<Url, A, R1>;

export type Middleware<
  A extends {},
  B extends {},
  R1 = Body,
  R2 = R1
> = _Middleware<A, B, R1, R2> & MiddlewareOps<A, B, R1, R2>;
export type IdMiddleware<A extends {}, R1 = Body> = _Middleware<A, A, R1, R1> &
  MiddlewareOps<A, A, R1, R1>;

type MiddlewareOps<A extends {}, B extends {}, R1 = Body, R2 = R1> = {
  andThen: <C extends {}, R3 = R2>(
    next: Middleware<B, C, R2, R3>
  ) => Middleware<A, B & C, R1, R3>;
};

const compose =
  <A extends {}, B extends {}, C extends {}, R1 = Body, R2 = R1, R3 = R2>(
    m1: _Middleware<A, B, R1, R2>,
    m2: _Middleware<B, C, R2, R3>
  ): _Middleware<A, Prettify<B & C>, R1, R3> =>
  (r) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    m1(m2(r as Handler<any, C, R3>));

const MiddlewareOps = <A extends {}, B extends {}, R1 = Body, R2 = R1>(
  mw: _Middleware<A, B, R1, R2>
): Middleware<A, B, R1, R2> => {
  const _mw = <Middleware<A, B, R1, R2>>mw;
  _mw.andThen = <C extends {}, R3 = R2>(next: Middleware<B, C, R2, R3>) =>
    MiddlewareOps(compose(mw, next));
  return _mw;
};

export const Middleware = {
  Id: <A extends {}, R1 = Body>() => MiddlewareOps<A, A, R1, R1>((h) => h),
  from: <A extends {}, B extends {}>(m: _Middleware<A, B>) => MiddlewareOps(m),
  of: <A extends {}, B extends {}, R1 = Body, R2 = R1>(
    f: <Url extends string>(
      req: Request<Url> & A,
      handler: Handler<Url, B, R2>
    ) => Promise<Response<R1>> | Response<R1>
  ): Middleware<A, B, R1, R2> => {
    const off: _Middleware<A, B, R1, R2> = (hb) => (r) => f(r, hb);
    return MiddlewareOps(off);
  },
};

// export const NullMiddleware: IdMiddleware<{}, Body> = MiddlewareOps(h => h)
export const NullMiddleware: <A extends {} = {}, R = Body>() => IdMiddleware<
  {},
  Body
> = () => MiddlewareOps((h) => h);
