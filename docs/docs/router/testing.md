---
title: Testing
description: Testing ezapi routing
slug: testing-ez-api-routing
sidebar_position: 3
---

# Route Testing

Splitting the route defintions from the route handling allows for some nice testability.

For example

```typescript
// api.ts
import { HandlersOf, RouteBuilder } from '@ezapi/router-core'
export const routeDefinitions = RouteBuilder
  .route(
      "getPersonById",
      "GET",
      "/people/{id}"
    )
  .route(
    "createPerson",
    "POST",
    "/people"
  )

export type ApiHandlers = HandlersOf<typeof routeDefinitions>

export const apiHandlers = (dependencies: {}): ApiHandlers => {
  getPersonById: (req) => { ... },
  createPerson: (req) => { ... }
 }

export const API = routeDefinitions.build(apiHandlers({}))
```

```typescript
// api.spec.ts
import { HandlersOf, RouteBuilder, Ok } from '@ezapi/router-core'
import { routeDefinitions, ApiHandlers } from "./api";
describe("routeDefinitions", () => {
  const fakeHandlers: ApiHandlers = {
    getPersonById: (req) => Ok(req.pathParams.id),
    createPerson: (req) => Ok("created"),
  };
  const sut = routeDefinitions.build(fakeHandlers);
  describe("getUserById", () => {
    it("should return a user", async () => {
      const testUserId = "123-456";
      const response = await sut.run({
        url: `/people/${testUserId}`,
        method: "GET",
        headers: {},
        query: {},
      });
      expect(response?.statusCode).toBe(200);
      expect(response?.body).toBe(testUserId);
    });
  });
});

```
