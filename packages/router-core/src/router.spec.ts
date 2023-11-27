/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HttpMiddleware } from "./middleware";
import { Ok } from "./responses";
import {
  ApiBuilder,
  HandlersOf,
  HttpClient,
  HttpMethod,
  RouteBuilder,
  Router,
} from "./router-builder";
import { Request, Response, Body, RequestParams } from "./types";

describe("Router", () => {
  const testMiddleware = <R>(stuff: string) =>
    HttpMiddleware.of<{}, { stuff: string }, R>(async (orig, handler) => {
      const newReq = { ...orig, ...{ stuff } };
      const response = await handler(newReq);
      return response;
    });
  describe("basic routing", () => {
    const routeDefinitions = RouteBuilder.route("pingPong", "GET", "/ping");
    it("should call handlers", async () => {
      let didCall = false;
      const api = routeDefinitions.build({
        pingPong: async (req) => {
          didCall = true;
          return Ok("OK");
        },
      });
      const response = await api.run({
        url: "/ping",
        method: "GET",
        headers: {},
        query: {},
      });

      expect(didCall).toBe(true);
      expect(response?.statusCode).toBe(200);
      expect(response?.body).toBe("OK");
    });

    it("should call handlers - case insensitve", async () => {
      let didCall = false;
      const api = routeDefinitions.build({
        pingPong: async (req) => {
          didCall = true;
          return Ok("OK");
        },
      });
      const response = await api.run({
        url: "/PING",
        method: "GET",
        headers: {},
        query: {},
      });

      expect(didCall).toBe(true);
      expect(response?.statusCode).toBe(200);
      expect(response?.body).toBe("OK");
    });

    it("should respect middleware", async () => {
      let didCall = false;
      const api = RouteBuilder.route(
        "createPerson",
        "GET",
        "/",
        testMiddleware("hello")
      ).build({
        createPerson: async (req) => {
          didCall = true;
          return Ok(req.stuff);
        },
      });
      const response = await api.run({
        url: "/",
        method: "GET",
        headers: {},
        query: {},
      });

      expect(didCall).toBe(true);
      expect(response?.statusCode).toBe(200);
      expect(response?.body).toBe("hello");
    });
  });
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
        [name as N]: (r: Request<RequestParams<Url>>) => Ok(JSON.stringify(r)),
      } as unknown as RouteHandlers;
      const router = routes.build(handlers);
      const response = await router.run({
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
      const response = await makeRequest("getUsers", "GET", "/users", "/users");
      expect(response).toBeTruthy();
      expect(response?.statusCode).toBe(200);
      const request = JSON.parse(response!.body.toString()) as Request<
        RequestParams<string>
      >;
      expect(request.url).toBe("/users");
    });
    it("should route a simple path with a single untyped parameter", async () => {
      const response = await makeRequest(
        "getUsers",
        "GET",
        "/users/{id}",
        "/users/1"
      );
      expect(response).toBeTruthy();
      expect(response?.statusCode).toBe(200);
      const request = JSON.parse(response!.body.toString()) as any;
      expect(request.url).toBe("/users/1");
      expect(request.pathParams.id).toBe("1");
    });
    it("should route a path with a single untyped parameter where the parameter contains forward slash", async () => {
      const response = await makeRequest(
        "getArticle",
        "GET",
        "/articles/{slug+}",
        "/articles/user-1/ez-api-is-cool"
      );
      expect(response).toBeTruthy();
      expect(response?.statusCode).toBe(200);
      const request = JSON.parse(response!.body.toString()) as any;
      expect(request.pathParams.slug).toBe("user-1/ez-api-is-cool");
    });
    it("should route a simple literal path over a parameterized path", async () => {
      const routeDefinitions = RouteBuilder.route(
        "allProducts",
        "GET",
        "/products/all"
      )
        .route("aProduct", "GET", "/products/{id}")
        .build({
          allProducts: () => Ok("All Products"),
          aProduct: () => Ok("A Product"),
        });
      const response = await routeDefinitions.run({
        url: "/products/all",
        method: "GET",
        headers: {},
        query: {},
      });
      expect(response).toBeTruthy();
      expect(response?.statusCode).toBe(200);
      expect(response?.body).toBe("All Products");
    });
    it("should route a HTTP Method match over an ANY match", async () => {
      const routeDefinitions = RouteBuilder.route(
        "getProducts",
        "GET",
        "/products/{id}"
      )
        .route("anyProducts", "ANY", "/products/{id}")
        .build({
          getProducts: () => Ok("getProducts"),
          anyProducts: () => Ok("anyProducts"),
        });
      const response = await routeDefinitions.run({
        url: "/products/1",
        method: "GET",
        headers: {},
        query: {},
      });
      expect(response).toBeTruthy();
      expect(response?.statusCode).toBe(200);
      expect(response?.body).toBe("getProducts");
    });
    it("should route a simple path with a single typed parameter", async () => {
      const response = await makeRequest(
        "getUserById",
        "GET",
        "/users/{id:int}",
        "/users/1"
      );
      expect(response).toBeTruthy();
      expect(response?.statusCode).toBe(200);
      const request = JSON.parse(response!.body.toString()) as any;
      expect(request.url).toBe("/users/1");
      expect(request.pathParams.id).toBe(1);
    });
    it("should route a simple path with multiple typed parameters", async () => {
      const template = "/users/{id:int}/name/{name:string}" as const;
      const response = await makeRequest(
        "getUserById",
        "GET",
        template,
        "/users/1/name/fred"
      );
      expect(response).toBeTruthy();
      expect(response?.statusCode).toBe(200);
      const request = JSON.parse(response!.body.toString()) as any;
      expect(request.url).toBe("/users/1/name/fred");
      expect(request.pathParams.id).toBe(1);
      expect(request.pathParams.name).toBe("fred");
    });
    it("should route a simple proxy path", async () => {
      const template = "/users/{proxy+}" as const;
      const response = await makeRequest(
        "getUserById",
        "GET",
        template,
        "/users/1/name/fred"
      );
      expect(response).toBeTruthy();
      expect(response?.statusCode).toBe(200);
      const request = JSON.parse(response!.body.toString()) as any;
      expect(request.url).toBe("/users/1/name/fred");
      expect(request.pathParams.proxy).toBe("1/name/fred");
    });
  });
  describe("query string routing", () => {
    it("should route a simple query string", async () => {
      const routeDefinitions2 = RouteBuilder.route(
        "searchPeople",
        "GET",
        "/people/{id}?{name}&{age:int}"
      );
      const router = routeDefinitions2.build({
        searchPeople: async (req) => {
          const nameQuery: string = req.queryParams.name;
          const ageQuery: number = req.queryParams.age;
          return Ok(JSON.stringify({ nameQuery, ageQuery }));
        },
      });
      const response = await router.run({
        url: "/people/1",
        method: "GET",
        headers: {},
        query: {
          name: "fred",
          age: "30",
        },
      });
      expect(response).toBeDefined();
      expect(response?.statusCode).toBe(200);
      const body = JSON.parse(response!.body.toString());
      expect(body.nameQuery).toBe("fred");
      expect(body.ageQuery).toBe(30);
    });
    it("should pass query strings that have not been defined", async () => {
      const routeDefinitions2 = RouteBuilder.route(
        "searchPeople",
        "GET",
        "/people/{id}?{name}&{age:int}"
      );
      const router = routeDefinitions2.build({
        searchPeople: async (req) => {
          const nameQuery: string = req.queryParams.name;
          const ageQuery: number = req.queryParams.age;
          const fooQuery: string | undefined = req.queryParams.foo;
          return Ok(JSON.stringify({ nameQuery, ageQuery, fooQuery }));
        },
      });
      const response = await router.run({
        url: "/people/1",
        method: "GET",
        headers: {},
        query: {
          name: "fred",
          age: "30",
          foo: "bar",
        },
      });
      expect(response).toBeDefined();
      expect(response?.statusCode).toBe(200);
      const body = JSON.parse(response!.body.toString());
      expect(body.nameQuery).toBe("fred");
      expect(body.ageQuery).toBe(30);
      expect(body.fooQuery).toBe("bar");
    });
  });
  describe("API Builder", () => {
    it("should route a simple query string", async () => {
      const peopleRoutes = RouteBuilder.route(
        "searchPeople",
        "GET",
        "/?{name}&{age:int}"
      );
      const peopleRouter = peopleRoutes.build({
        searchPeople: async (req) => {
          const nameQuery: string = req.queryParams.name;
          const ageQuery: number = req.queryParams.age;
          return Ok(JSON.stringify({ nameQuery, ageQuery }));
        },
      });
      const carRoutes = RouteBuilder.route(
        "searchCars",
        "GET",
        "/?{make}&{model}"
      );
      const carRoutes2 = RouteBuilder.route("getCar", "GET", "/{id}");
      const carRouter = carRoutes.build({
        searchCars: async (req) => {
          const makeQuery = req.queryParams.make;
          const modelQuery = req.queryParams.model;
          return Ok(JSON.stringify({ makeQuery, modelQuery }));
        },
      });
      const carRouter2 = carRoutes2.build({
        getCar: async (req) => {
          return Ok(JSON.stringify({ drive: "Vroom!" }));
        },
      });
      const api: Router = ApiBuilder.build({
        "/people": peopleRouter,
        "/cars": [carRouter, carRouter2],
      });
      const peopleResponse = await api.run({
        url: "/people",
        method: "GET",
        headers: {},
        query: {
          name: "fred",
          age: "30",
        },
      });
      expect(peopleResponse).toBeDefined();
      expect(peopleResponse?.statusCode).toBe(200);
      const peopleBody = JSON.parse(peopleResponse!.body.toString());
      expect(peopleBody.nameQuery).toBe("fred");
      expect(peopleBody.ageQuery).toBe(30);

      const carResponse = await api.run({
        url: "/cars",
        method: "GET",
        headers: {},
        query: {
          make: "GoGoMobile",
          model: "Dart",
        },
      });
      expect(carResponse).toBeDefined();
      expect(carResponse?.statusCode).toBe(200);
      const carBody = JSON.parse(carResponse!.body.toString());
      expect(carBody.makeQuery).toBe("GoGoMobile");
      expect(carBody.modelQuery).toBe("Dart");

      const carResponse2 = await api.run({
        url: "/cars/1",
        method: "GET",
        headers: {},
        query: { },
      });
      expect(carResponse2).toBeDefined();
      expect(carResponse2?.statusCode).toBe(200);
      const carBody2 = JSON.parse(carResponse2!.body.toString());
      expect(carBody2.drive).toBe("Vroom!");
    });
    it("should respect middleware", async () => {
      const routeDefinitions2 = RouteBuilder.route(
        "searchPeople",
        "GET",
        "/{id}?{name}&{age:int}"
      ).route("createPerson", "POST", "/", testMiddleware("hello"));
      const router = routeDefinitions2.build({
        searchPeople: async (req) => {
          const nameQuery: string = req.queryParams.name;
          const ageQuery: number = req.queryParams.age;
          return Ok(JSON.stringify({ nameQuery, ageQuery }));
        },
        createPerson: async (req) => {
          return Ok(req.stuff);
        },
      });
      const api = ApiBuilder.build({
        "/people": router,
      });
      const response = await api.run({
        url: "/people",
        method: "POST",
        headers: {},
        query: {},
        body: JSON.stringify({ name: "fred", age: 30 }),
      });
      expect(response).toBeDefined();
      expect(response?.statusCode).toBe(200);
      const body = response!.body.toString();
      expect(body).toBe("hello");
    });
  });
});
