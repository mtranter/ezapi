import { ParamParser, ParamParsers } from "./param-parser";

export interface QueryStringParserFault {
  fieldName: string;
  type: string;
  message: string;
}
const errorSymbol = Symbol("ERROR")
export interface QueryStringParserError {
  [errorSymbol]: true;
  faults: QueryStringParserFault[];
  withFault: (f: QueryStringParserFault) => QueryStringParserError;
}
export const isQsError = (
  a: QueryStringParserError | unknown
): a is QueryStringParserError => !!(a as QueryStringParserError)[errorSymbol];
const qsError = (
  ...faults: QueryStringParserFault[]
): QueryStringParserError => ({
  [errorSymbol]: true,
  faults,
  withFault: (f: QueryStringParserFault) => qsError(...[...faults, f]),
});

export const parseQuery = (
  spec: string,
  query: Record<string, string | undefined>
):
  | {
      [key: string]: unknown;
    }
  | QueryStringParserError => {
  const parser = new ParamParsers();

  const specRegex = /{([^}]*)}/g;
  const matches = spec.match(specRegex);

  return (
    matches?.reduce((p, n) => {
      const token = n.slice(1, -1);
      const keyValue = token.split(":");
      const keyName = keyValue[0];
      const { key, optional } = keyName.endsWith("?")
        ? { key: keyName.slice(0, -1), optional: true }
        : { key: keyName, optional: false };
      const valueType = keyValue[1] || "string";
      const parseFn = (
        parser as unknown as Record<string, ParamParser<unknown>>
      )[valueType] as ParamParser<unknown>;
      if (!parseFn) {
        const fault = {
          fieldName: key,
          message: `Unknown type: ${valueType}`,
          type: "UnknownType",
        };
        return isQsError(p) ? p.withFault(fault) : qsError(fault);
      }
      const value = query[key];
      if (!value && !optional) {
        const fault = {
          fieldName: key,
          message: `Value Not Provided: ${key}`,
          type: "ValueNotProvided",
        };
        return isQsError(p) ? p.withFault(fault) : qsError(fault);
      }
      const parsed = value ? parseFn.parse(value) : undefined;
      if (parsed && !parsed.isRight) {
        const fault = {
          fieldName: key,
          message: `Cannot parse '${value}' to ${valueType} for key: ${key}`,
          type: "BadRequest",
        };
        return isQsError(p) ? p.withFault(fault) : qsError(fault);
      }
      return isQsError(p) ? p : { ...p, [key]: parsed?.value };
    }, query as Record<string, unknown | undefined> | QueryStringParserError) ||
    query
  );
};