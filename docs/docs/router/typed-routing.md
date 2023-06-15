---
sidebar_position: 2
slug: ex-api-typed-routing
---

# Typed Routing

The DSL provides some typesafe candy for developer productivity

### Path Params

Any path params defined in the URL template, will appear on the handler Request object under the `pathParams` property.

For example

```typescript
const routeDefinitions = RouteBuilder.route(
  "getPersonById",
  "GET",
  "/people/{id}"
).build({
  getPersonById: async (req) => {
    const personId: string = req.pathParams.id; // <-- typesafe fun!
    return Ok("OK");
  },
});
```

These params can also be explicitly typed

```typescript
const routeDefinitions = RouteBuilder.route(
  "getPersonById",
  "GET",
  "/people/{id:int}"
).build({
  getPersonById: async (req) => {
    const personId: number = req.pathParams.id; // <-- more typesafe fun!
    return Ok("OK");
  },
});
```

At the moment, the only types available are int, float and string. This has been designed to be extensible

:::danger ToDo 

Test and document extending the url parameter parser

:::
### Query Strings

These same code candy works for query strings

```typescript
import { RouteBuilder, Ok } from "@ezapi/router-core";
const routeDefinitions = RouteBuilder.route("searchPeople", "GET", "/people?{name}&{age:int}")
  .build({
    getPersonById: async (req) => {
      const nameQuery: string = req.queryParams.name
      const ageQuery: number = req.queryParams.age
      return Ok("OK")
    }
  })
```

The above route definition will not much a request without the name and age query parameters.

#### Optional Query String Params
If you wish a query parameter to be optional, you can post-fix it with a `?`

```typescript
import { RouteBuilder, Ok } from "@ezapi/router-core";
const routeDefinitions = RouteBuilder.route("searchPeople", "GET", "/people?{name?}&{age?:int}")
  .build({
    getPersonById: async (req) => {
      const nameQuery: string | undefined = req.queryParams.name
      const ageQuery: number | undefined = req.queryParams.age
      return Ok("OK")
    }
  })
```