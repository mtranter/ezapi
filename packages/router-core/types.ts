/* eslint-disable @typescript-eslint/no-unused-vars */
import { ParamParser, ParamParsers } from "./param-parser";
import { HttpMethod } from "./router-builder";

type _<T> = T;
export type Merge<T> = _<{ [k in keyof T]: T[k] }>;
export type Trim<T> = T extends `/${infer Rest}${"/" | ""}` ? Trim<Rest> : T;

type TypeOfParser<T> = T extends ParamParser<infer A> ? A : never;
type ParserType<T extends keyof ParamParsers> = TypeOfParser<ParamParsers[T]>;

type PathParam<S extends string> = S extends `${infer Var}:${infer VarType}`
  ? VarType extends keyof ParamParsers
    ? { readonly [key in Var]: ParserType<VarType> }
    : never
  : S extends `${infer Var}+`
  ? { readonly [key in Var]: string }
  : S extends `${infer Var}`
  ? { readonly [key in Var]: string }
  : never;

type PathParams<
  A extends string,
  Seed = {}
> = A extends `{${infer AA}}${infer Tail}`
  ? Merge<Seed & PathParam<AA> & PathParams<Tail>>
  : A extends `${infer _}{${infer AA}}${infer Tail}`
  ? Merge<Seed & PathParam<AA> & PathParams<Tail>>
  : A extends `${infer _}{${infer AA}}`
  ? Merge<Seed & PathParam<AA>>
  : Seed;

type UrlParam<
  S extends string,
  P = string
> = S extends `${infer Var}:${infer VarType}`
  ? VarType extends keyof ParamParsers
    ? UrlParam<Var, ParserType<VarType>>
    : never
  : S extends `${infer Var}?`
  ? { readonly [key in Var]?: P }
  : S extends `${infer Var}`
  ? { readonly [key in Var]: P }
  : never;

type QueryParams<
  A extends string,
  Seed = Record<string, string | undefined>
> = A extends `{${infer AA}}${infer Tail}`
  ? Tail extends `&${infer Q}`
    ? Merge<Seed & UrlParam<AA> & QueryParams<Q>>
    : Merge<Seed & UrlParam<AA>>
  : Seed;

export type Body = string | Buffer;

export type Request<Url extends string> = {
  pathParams: Url extends `${infer P}?${infer _}`
    ? PathParams<P>
    : PathParams<Url>;
  queryParams: Url extends `${infer _}?${infer Q}`
    ? QueryParams<Q> & Record<string, string | undefined>
    : Record<string, string> | undefined;
  body?: Body;
  url: Url;
  method: HttpMethod;
  headers: { [k: string]: string | string[] | undefined };
};

export type Headers = {
  [header: string]: string;
};
export type Response<B = Body> = {
  statusCode: number;
  headers?: Headers;
  body: B;
};

export type Handler<Url extends string, A extends {} = {}, B = Body> = (
  req: Request<Url> & A
) => Promise<Response<B>> | Response<B>;
