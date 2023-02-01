type Right<A> = {
    value: A,
    isRight: true
};
type Left<A> = {
    value: A,
    isRight: false
};

type LeftOrRight<E, A> = (Right<A> | Left<E>)

export const isRight = <E, A>(e: LeftOrRight<E, A>): e is Right<A> => e.isRight

type EitherOps<E, A> = {
    map: <B>(f: (a: A) => B) => Either<E, B>
    leftMap: <B>(f: (a: E) => B) => Either<B, A>
    flatMap: <B>(f: (a: A) => Either<E, B>) => Either<E, B>
    leftFlatMap: <B>(f: (a: E) => Either<B, A>) => Either<B, A>
    match: <B>(m: { right: (b: A) => B, left: (e: E) => B }) => B
};

export type Either<E, A> = LeftOrRight<E, A> & EitherOps<E, A>
  
const makeOps = <E, A>(a: LeftOrRight<E, A>): Either<E, A> => ({
  ...a,
  ...{
    map: (f) => (isRight(a) ? Right(f(a.value)) : Left(a.value)),
    leftMap: (f) => (!isRight(a) ? Left(f(a.value)) : Right(a.value)),
    flatMap: (f) => (isRight(a) ? f(a.value) : Left(a.value)),
    leftFlatMap: (f) => (!isRight(a) ? f(a.value) : Right(a.value)),
    match: (m) => (isRight(a) ? m.right(a.value) : m.left(a.value)),
  },
});

export const Right = <E, A>(a: A): Either<E, A> =>
  makeOps<E, A>({
    isRight: true,
    value: a,
  });
export const Left = <E, A>(a: E): Either<E, A> =>
  makeOps<E, A>({
    isRight: false,
    value: a,
  });