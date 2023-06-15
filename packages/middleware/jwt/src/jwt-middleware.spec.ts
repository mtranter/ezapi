/* eslint-disable @typescript-eslint/ban-ts-comment */
import jwt from "jsonwebtoken";
import { JwtMiddleware } from "./jwt-middleware";
import {
  Handler,
  Request,
  RequestParams,
  Response,
  Ok,
  RouteBuilder,
} from "@ezapi/router-core";

const DEMO_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

describe("JwtMiddleware", () => {
  const verifyOk = {
    // @ts-ignore
    verify: (token, secret, options, cb) => {
      cb(null, { sub: "test" });
    },
  };
  const verifyBad = {
    // @ts-ignore
    verify: (token, secret, options, cb) => {
      cb("Bad Token");
    },
  };
  describe("auth header missing", () => {
    it("should return Unauthorized", async () => {
      const middleware = JwtMiddleware({
        secret: "secret",
      });
      const handler: jest.Mock<Promise<Response>, Request<{}>[]> = jest.fn();
      handler.mockResolvedValue(Ok("ok"));
      const wrapped = middleware(handler);
      const response = await wrapped({
        headers: {},
      } as Request<{}>);

      expect(response.statusCode).toBe(401);
    });
  });
  describe("auth header with bad schema", () => {
    it("should return Unauthorized", async () => {
      const middleware = JwtMiddleware({
        secret: "secret",
      });
      const handler: jest.Mock<Promise<Response>, Request<{}>[]> = jest.fn();
      handler.mockResolvedValue(Ok("ok"));
      const wrapped = middleware(handler);
      const response = await wrapped({
        headers: {
          authorization: "Basic " + DEMO_JWT,
        },
      } as unknown as Request<{}>);

      expect(response.statusCode).toBe(401);
    });
  });
  describe("bad token", () => {
    it("should return Unauthorized", async () => {
      const middleware = JwtMiddleware({
        secret: "secret",
        // @ts-ignore
        verifier: verifyBad,
      });
      const handler: jest.Mock<Promise<Response>, Request<{}>[]> = jest.fn();
      handler.mockResolvedValue(Ok("ok"));
      const wrapped = middleware(handler);
      const response = await wrapped({
        headers: {
          authorization: "Bearer " + DEMO_JWT,
        },
      } as unknown as Request<{}>);

      expect(response.statusCode).toBe(401);
    });
  });
  describe("valid token", () => {
    it("should return Unauthorized", async () => {
      const middleware = JwtMiddleware({
        secret: "secret",
        // @ts-ignore
        verifier: verifyOk,
      });
      const handler: jest.Mock<Promise<Response>, Request<{}>[]> = jest.fn();
      handler.mockResolvedValue(Ok("ok"));
      const wrapped = middleware(handler);
      const response = await wrapped({
        headers: {
          authorization: "Bearer " + DEMO_JWT,
        },
      } as unknown as Request<{}>);

      expect(response.statusCode).toBe(200);
      expect(handler).toHaveBeenCalled();
    });
  });
});
