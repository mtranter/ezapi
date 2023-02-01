import { Either, Left, Right } from "./either";

export type ParserError = { errors: string[] };
export type ParamParser<T> = {
    parse: (s: string) => Either<ParserError, T>;
  };

export class ParamParsers {
    string: ParamParser<string> = {
      parse: (s) => Right(decodeURIComponent(s))
    };
    int: ParamParser<number> = {
      parse: (s) => {
        const result = parseInt(s);
        return isNaN(result)
          ? Left({ errors: [`Invalid int in path param: ${s}`] })
          : Right(result);
      },
    };
    float: ParamParser<number> = {
      parse: (s) => {
        const result = parseFloat(s);
        return isNaN(result)
          ? Left({ errors: [`Invalid float in path param: ${s}`] })
          : Right(result);
      },
    };
  }