---
sidebar_position: 1
slug: ez-api-middleware
description: Using EZAPI Middleware
title: Usage
---

# Middleware

EZApi has a composable, extensible, strongly typed middleware system.

The quickest way to grok how to use middleware is by example. The below examples show how to use two of the middlewares distributed with EZAPI: `JsonParserMiddlerware` and `ZodMiddleware`.

### JsonParserMiddlerware

The `JsonParserMiddlerware` allows us to expect JSON requests and return JSON responses.

```typescript
import { RouteBuilder } from "@ezapi/router-core";
import { JsonParserMiddlerware } from "@ezapi/json-middleware";

const routeDefinition = RouteBuilder.withMiddleware(
  JsonParserMiddlerware
)
  .route("getPersonById", "GET", "/people/{id:int}")
  .route("createPerson", "POST", "/people")
  .build({
    getPersonById: async (r) => {
      const person = await someRepo.getPerson(r.pathParams.id);
      return person
        ? Ok(person)
        : NotFound(`Person ${r.pathParams.id} not found`);
    },
    createPerson: async (req) => {
      const personRequest = req.jsonBody;
      const newPerson = { id: genId(), ...personRequest };
      await someRepo.putPerson(newPerson);
      return Created(newPerson, `/people/${newPerson.id}`);
    },
  });
```

The Json middleware checks the content-type headers are appropriate, and parses the incoming request body to JSON and attaches it to a property called `jsonBody` on the request object.

### ZodMiddleware

The above is OK.. But we are trusting that the client is sending us a valid `personRequesst` object.
The `ZodMiddleware` lets us improve on this somewhat.

```typescript
import { RouteBuilder, Ok, NotFound, Created } from "@ezapi/router-core";
import { JsonParserMiddlerware } from "@ezapi/json-middleware";
import { ZodMiddleware } from "@ezapi/zod-middleware";
import { z } from "zod";

const PersonRequestSchema = z.object({
  name: z.string(),
});

const routeDefinition = RouteBuilder.withMiddleware(
  JsonParserMiddlerware
)
  .route("createPerson", "POST", "/people", ZodMiddleware(PersonRequestSchema))
  .build({
    createPerson: async (req) => {
      const personRequest = req.safeBody;
      const newPerson = { id: genId(), ...personRequest };
      await someRepo.putPerson(newPerson);
      return Created(newPerson, `/people/${newPerson.id}`);
    },
  });
```

This improves on the `JsonParserMiddlerware` example. In this case, the `ZodMiddleware` with a valid `Zod` schema object is provided to a specific route.
The Zod Schema validates the incoming JSON to correctness, and if correct, attaches the parsed, typesafe payload to the `safeBody` property on the request.
If the incoming request is invalid, ezapi will return a 400 with a validation message to the client.

Note that the `JsonParserMiddlerware` is still provided at a global route level - that is, it will be used across all routes. The `ZodMiddleware` has an expectation that a `jsonBody` property will exist on the incoming request, and this expectation will be checked at compile time. Its this composability, that allows routeHandlers to track which middleware have been added into the request pipeline.
