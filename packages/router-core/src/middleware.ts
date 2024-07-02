import { Body, Handler, Prettify, Request, Response } from "./types";

const PassThrough = Symbol("PassThrough");
export type PassThrough = typeof PassThrough;

type _Middleware<A, B, R1, R2> = <AA extends A = A>(
  handler: Handler<Prettify<AA & B>, R2>
) => Handler<AA, R1>;

export type Middleware<A, B, R1 = Body, R2 = R1> = _Middleware<A, B, R1, R2> &
  MiddlewareOps<A, B, R1, R2>;

export type IdMiddleware<A, R1> = _Middleware<A, A, R1, R1> &
  MiddlewareOps<A, A, R1, R1>;

type MiddlewareOps<A, B, R1 = Body, R2 = R1> = {
  andThen: <C, R3 = R2>(
    next: Middleware<B, C, R2, R3>
  ) => Middleware<A, B & C, R1, R3>;
};

const compose =
  <A, B, C, R1 = Body, R2 = R1, R3 = R2>(
    m1: _Middleware<A, B, R1, R2>,
    m2: _Middleware<B, C, R2, R3>
  ): _Middleware<A, B & C, R1, R3> =>
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
  return _mw;
};

export type HttpMiddleware<A, B, R1, R2> = Middleware<
  Request<A>,
  Request<B>,
  Response<R1>,
  Response<R2>
>;

type PTU<T> = T extends PassThrough ? unknown : T;
export const HttpMiddleware = {
  Id: <A, R1 = Body>() =>
    MiddlewareOps<Request<A>, Request<A>, Response<R1>, Response<R1>>((h) => h),
  of: <A = PassThrough, B = PassThrough, R1 = PassThrough, R2 = PassThrough>(
    f: (
      originalRequest: Request<PTU<A>>,
      handler: Handler<Request<PTU<A> & PTU<B>>, Response<R2>>
    ) => Promise<Response<R1>> | Response<R1>
  ): HttpMiddleware<A, B, R1, R2> => {
    const off: _Middleware<
      Request<PTU<A>>,
      Request<PTU<B>>,
      Response<R1>,
      Response<R2>
    > = (hb) => (r) =>
      f(r as Request<PTU<A>>, hb as Handler<Request<PTU<B>>, Response<R2>>);
    return MiddlewareOps(off) as HttpMiddleware<A, B, R1, R2>;
  },
  from: <A = PassThrough, B = PassThrough, R1 = PassThrough, R2 = PassThrough>(
    mw: _Middleware<
      Request<PTU<A>>,
      Request<PTU<B>>,
      Response<PTU<R1>>,
      Response<PTU<R2>>
    >
  ): HttpMiddleware<A, B, R1, R2> =>
    MiddlewareOps(mw) as HttpMiddleware<A, B, R1, R2>,
};
