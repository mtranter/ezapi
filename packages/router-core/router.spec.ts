/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BackendUtils } from "./backend";
import { Ok } from "./responses";
import { HttpMethod, RouteBuilder } from "./router-builder";
import { Request, Response, Body } from "./types";

describe("Router", () => {
  describe("path routing", () => {
    const makeRequest = async <Url extends string>(
      method: HttpMethod,
      template: Url,
      url: string
    ): Promise<Response<Body> | undefined> => {
      const routes = RouteBuilder.route(method, template)
        .handle((r) => Ok(JSON.stringify(r)))
        .build();
      const testServer = BackendUtils.buildHandler(routes);
      const response = await testServer({
        url,
        method: "GET",
        headers: {},
        query: {},
      });
      return response;
    };
    it("should return null response for unknown url", async () => {
      const response = await makeRequest("GET", "/users", "/bad-users");
      expect(response).toBeUndefined();
    });

    it("should route a simple path without parameters", async () => {
      const response = await makeRequest("GET", "/users", "/users");
      expect(response).toBeTruthy();
      expect(response?.statusCode).toBe(200);
      const request = JSON.parse(response!.body.toString()) as Request<string>;
      expect(request.url).toBe("/users");
    });
    it("should route a simple path with a single untyped parameter", async () => {
      const response = await makeRequest("GET", "/users/{id}", "/users/1");
      expect(response).toBeTruthy();
      expect(response?.statusCode).toBe(200);
      const request = JSON.parse(
        response!.body.toString()
      ) as Request<"/users/{id}">;
      expect(request.url).toBe("/users/1");
      expect(request.pathParams.id).toBe("1");
    });
    it("should route a simple path with a single typed parameter", async () => {
      const response = await makeRequest("GET", "/users/{id:int}", "/users/1");
      expect(response).toBeTruthy();
      expect(response?.statusCode).toBe(200);
      const request = JSON.parse(
        response!.body.toString()
      ) as Request<"/users/{id:int}">;
      expect(request.url).toBe("/users/1");
      expect(request.pathParams.id).toBe(1);
    });
    it("should route a simple path with multiple typed parameters", async () => {
      const template = "/users/{id:int}/name/{name:string}" as const;
      const response = await makeRequest("GET", template, "/users/1/name/fred");
      expect(response).toBeTruthy();
      expect(response?.statusCode).toBe(200);
      const request = JSON.parse(response!.body.toString()) as Request<
        typeof template
      >;
      expect(request.url).toBe("/users/1/name/fred");
      expect(request.pathParams.id).toBe(1);
      expect(request.pathParams.name).toBe("fred");
    });
    it("should route a simple proxy path", async () => {
      const template = "/users/{proxy+}" as const;
      const response = await makeRequest("GET", template, "/users/1/name/fred");
      expect(response).toBeTruthy();
      expect(response?.statusCode).toBe(200);
      const request = JSON.parse(response!.body.toString()) as Request<
        typeof template
      >;
      expect(request.url).toBe("/users/1/name/fred");
      expect(request.pathParams.proxy).toBe("1/name/fred");
    });
  });
});
