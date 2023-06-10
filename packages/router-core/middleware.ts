import { Handler, Prettify, Request, RequestParams, Response } from "./types";

// eslint-disable-next-line @typescript-eslint/ban-types
type _Middleware<A, B, R1, R2> = (
  handler: Handler<A & B, R2>
) => Handler<A, R1>;

export type Middleware<A, B, R1 = Body, R2 = R1> = _Middleware<A, B, R1, R2> &
  MiddlewareOps<A, B, R1, R2>;

export type IdMiddleware<A, R1> = _Middleware<A, A, R1, R1> &
  MiddlewareOps<A, A, R1, R1>;

type MiddlewareOps<A, B, R1 = Body, R2 = R1> = {
  andThen: <C, R3 = R2>(
    next: Middleware<B, C, R2, R3>
  ) => Middleware<A, B & C, R1, R3>;
  widen: <W>() => Middleware<A & W, B, R1, R2>;
};

const compose =
  <A, B, C, R1 = Body, R2 = R1, R3 = R2>(
    m1: _Middleware<A, B, R1, R2>,
    m2: _Middleware<B, C, R2, R3>
  ): _Middleware<A, Prettify<B & C>, R1, R3> =>
  (r) => {
    const r2 = m2(r as Handler<C, R3>);
    return m1(r2 as Handler<B, R2>);
  };

const MiddlewareOps = <A, B, R1 = Body, R2 = R1>(
  mw: _Middleware<A, B, R1, R2>
): Middleware<A, B, R1, R2> => {
  const _mw = <Middleware<A, B, R1, R2>>mw;
  _mw.andThen = <C, R3 = R2>(next: Middleware<B, C, R2, R3>) =>
    MiddlewareOps(compose(mw, next)) as Middleware<A, B & C, R1, R3>;
  _mw.widen = <W>() => _mw as Middleware<A & W, B, R1, R2>;
  return _mw;
};


export type HttpMiddleware<A, B, R1, R2> = Middleware<
  Request<A>,
  Request<B>,
  Response<R1>,
  Response<R2>
>;
export const HttpMiddleware = {
  Id: <A, R1 = Body>() =>
    MiddlewareOps<Request<A>, Request<A>, Response<R1>, Response<R1>>((h) => h),
  of: <A, B, R1, R2>(
    f: (
      req: Request<A>,
      handler: Handler<Request<B>, Response<R2>>
    ) => Promise<Response<R1>> | Response<R1>
  ): HttpMiddleware<A, B, R1, R2> => {
    const off: _Middleware<
      Request<A>,
      Request<B>,
      Response<R1>,
      Response<R2>
    > = (hb) => (r) => f(r, hb as Handler<Request<B>, Response<R2>>);
    return MiddlewareOps(off);
  },
  from: <A, B, R1, R2>(
    m: _Middleware<Request<A>, Request<B>, Response<R1>, Response<R2>>
  ) =>  MiddlewareOps(m)
};

// export const NullMiddleware: IdMiddleware<{}, Body> = MiddlewareOps(h => h)
export const NullMiddleware: <A, B>() => IdMiddleware<A, B> = () =>
  MiddlewareOps((h) => h);
