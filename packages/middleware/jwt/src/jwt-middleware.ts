import { HttpMiddleware, Unauthorized } from "@ezapi/router-core";
import jwt, { GetPublicKeyOrSecret, Secret, VerifyOptions } from "jsonwebtoken";

type JwtClaims = {
  sub: string; // Subject - identifies the principal that is the subject of the JWT
  iat: number; // Issued At - timestamp indicating when the JWT was issued
  exp: number; // Expiration Time - timestamp indicating when the JWT expires
  [key: string]: string | number | boolean | undefined; // Additional custom claims
};

export type JwtMiddlewareOptions = {
  verifyOptions?: VerifyOptions;
  secret: Secret | GetPublicKeyOrSecret;
  verifier?: Pick<typeof jwt, "verify">;
};

export const JwtMiddleware = ({
  verifyOptions,
  secret,
  verifier,
}: JwtMiddlewareOptions) =>
  HttpMiddleware.from<{}, { jwtClaims: JwtClaims; jwtToken: string }, unknown, unknown>(
    (handler) => async (req) => {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (!authHeader) {
        return Unauthorized("Missing Authorization header");
      }
      if (Array.isArray(authHeader)) {
        return Unauthorized("Multiple Authorization headers");
      }
      const [scheme, token] = authHeader.split(" ");
      if (scheme !== "Bearer") {
        return Unauthorized("Invalid Authorization scheme");
      }
      try {
        const jwtClaims = await new Promise<JwtClaims>((resolve, reject) => {
          (verifier ?? jwt).verify(
            token,
            secret,
            {
              ...verifyOptions,
              complete: false,
            },
            (e, t) => (e ? reject(e) : resolve(t as JwtClaims))
          );
        });
        return handler({ ...req, jwtClaims: jwtClaims, jwtToken: token });
      } catch (err: any) {
        return Unauthorized(err.message);
      }
    }
  );
