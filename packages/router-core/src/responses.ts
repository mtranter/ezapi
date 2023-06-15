import { Response, Headers } from "./types";

const withStatusCode =
  (
    statusCode: number,
    defaultHeaders?: Headers
  ): (<A>(body: A, headers?: Headers) => Response<A>) =>
  (body, headers) => ({
    statusCode,
    body,
    headers: { ...defaultHeaders, ...headers },
  });

const withLocation =
  (
    statusCode: number
  ): (<A>(body: A, location: string, headers?: Headers) => Response<A>) =>
  (body, location, headers) => ({
    statusCode,
    body,
    headers: { location, ...headers },
  });

export const RespondWith = <A>(
  statusCode: number,
  body: A,
  headers: Headers
): Response<A> => ({
  statusCode,
  body,
  headers,
});

export const Ok = withStatusCode(200);
export const Created = withLocation(201);
export const Accepted = withStatusCode(202);
export const NoContent = (): Response<undefined> => ({
  statusCode: 203,
  body: undefined,
});
export const MovedPermanently = withStatusCode(301);
export const Found = withStatusCode(302);
export const SeeOther = withStatusCode(303);
export const TemporaryRedirect = withStatusCode(307);
export const PermanentRedirect = withStatusCode(308);
export const BadRequest = withStatusCode(400);
export const Unauthorized = withStatusCode(401);
export const PaymentRequired = withStatusCode(402);
export const Forbidden = withStatusCode(403);
export const NotFound = withStatusCode(404);
export const MethodNotAllowed = withStatusCode(405);
export const NotAcceptable = withStatusCode(406);
export const ProxyAuthenticationRequired = withStatusCode(407);
export const RequestTimeout = withStatusCode(408);
export const Conflict = withStatusCode(409);
export const Gone = withStatusCode(410);
export const LengthRequired = withStatusCode(411);
export const PreconditionFailed = withStatusCode(412);
export const PayloadTooLarge = withStatusCode(413);
export const URITooLong = withStatusCode(414);
export const UnsupportedMediaType = withStatusCode(415);
export const UnprocessableEntity = withStatusCode(422);
