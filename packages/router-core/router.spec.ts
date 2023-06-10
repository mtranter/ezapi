/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BackendUtils } from "./backend";
import { Ok } from "./responses";
import { HandlersOf, HttpMethod, RouteBuilder } from "./router-builder";
import { Request, Response, Body, RequestParams } from "./types";

describe("Router", () => {
  describe("path routing", () => {
    const makeRequest = async <N extends string, Url extends string>(
      name: N,
      method: HttpMethod,
      template: Url,
      url: string
    ): Promise<Response<Body> | undefined> => {
      const routes = RouteBuilder.route(name as N, method, template);
      type RouteHandlers = HandlersOf<typeof routes>;
      const handlers = {
        [name as N]: (r: Request<RequestParams<Url>>) =>
          Ok(JSON.stringify(r)),
      } as RouteHandlers;
      const router = routes.build(handlers);
      const testServer = BackendUtils.buildHandler(router);
      const response = await testServer({
        url,
        method: "GET",
        headers: {},
        query: {},
      });
      return response;
    };
    it("should return null response for unknown url", async () => {
      const response = await makeRequest(
        "getUsers",
        "GET",
        "/users",
        "/bad-users"
      );
      expect(response).toBeUndefined();
    });

    it("should route a simple path without parameters", async () => {
      const response = await makeRequest('getUsers', "GET", "/users", "/users");
      expect(response).toBeTruthy();
      expect(response?.statusCode).toBe(200);
      const request = JSON.parse(response!.body.toString()) as Request<
        RequestParams<string>
      >;
      expect(request.url).toBe("/users");
    });
    it("should route a simple path with a single untyped parameter", async () => {
      const response = await makeRequest('getUsers', "GET", "/users/{id}", "/users/1");
      expect(response).toBeTruthy();
      expect(response?.statusCode).toBe(200);
      const request = JSON.parse(response!.body.toString()) as any;
      expect(request.url).toBe("/users/1");
      expect(request.pathParams.id).toBe("1");
    });
    it("should route a simple path with a single typed parameter", async () => {
      const response = await makeRequest('getUserById', "GET", "/users/{id:int}", "/users/1");
      expect(response).toBeTruthy();
      expect(response?.statusCode).toBe(200);
      const request = JSON.parse(response!.body.toString()) as any;
      expect(request.url).toBe("/users/1");
      expect(request.pathParams.id).toBe(1);
    });
    it("should route a simple path with multiple typed parameters", async () => {
      const template = "/users/{id:int}/name/{name:string}" as const;
      const response = await makeRequest('getUserById', "GET", template, "/users/1/name/fred");
      expect(response).toBeTruthy();
      expect(response?.statusCode).toBe(200);
      const request = JSON.parse(response!.body.toString()) as any;
      expect(request.url).toBe("/users/1/name/fred");
      expect(request.pathParams.id).toBe(1);
      expect(request.pathParams.name).toBe("fred");
    });
    it("should route a simple proxy path", async () => {
      const template = "/users/{proxy+}" as const;
      const response = await makeRequest('getUserById', "GET", template, "/users/1/name/fred");
      expect(response).toBeTruthy();
      expect(response?.statusCode).toBe(200);
      const request = JSON.parse(response!.body.toString()) as any;
      expect(request.url).toBe("/users/1/name/fred");
      expect(request.pathParams.proxy).toBe("1/name/fred");
    });
  });
});
