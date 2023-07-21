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

export type PathParams<
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

export type WithoutQueryString<S extends string> =
  S extends `${infer T}?${infer _}` ? T : S;
export type ExtractQueryString<S extends string> =
  S extends `${infer _}?${infer T}` ? T : "";

export type QueryParams<
  A extends string,
  Seed = {}
> = A extends `{${infer AA}}${infer Tail}`
  ? Tail extends `&${infer Q}`
    ? Merge<Seed & UrlParam<AA> & QueryParams<Q>>
    : Merge<Seed & UrlParam<AA>>
  : Seed;

export type Body = string | Buffer;
export type RequestParams<S extends string> = {
  pathParams: PathParams<WithoutQueryString<S>>;
  queryParams: QueryParams<ExtractQueryString<S>> & {
    readonly [k: string]: string | undefined;
  };
};

export type Request<A> = {
  body?: Body;
  url: string;
  method: HttpMethod;
  headers: { [k: string]: string | string[] | undefined };
} & A;

export type Headers = {
  [header: string]: string;
};
export type Response<B = Body> = {
  statusCode: number;
  headers?: Headers;
  body: B;
};

export type Handler<A, B> = (req: A) => Promise<B> | B;

export type HttpHandler<Url extends string, B> = Handler<
  Request<RequestParams<Url>>,
  Response<B>
>;

export type Prettify<A> = {
  [K in keyof A]: A[K];
} & {};

export type ApiHandler = ({
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
}) => Promise<Response | undefined>;

// const dummyReq: RequestParams<"/people/{id}?{name}&{age:int}"> = {
//   pathParams: {
//     id: "1",
//   },
//   queryParams: {
//     name: "John",
//     age: 12,
//   },
// };
