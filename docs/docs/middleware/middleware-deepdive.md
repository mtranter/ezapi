---
sidebar_position: 3
slug: ez-api-middleware-deepdive
title: Deepdive
---

# Middleware Deepdive

EZApi handlers are simple function types.

```typescript
type Handler<A, B> = (a: A) => B | Promise<B>;
```

This is typescript speak for a function that takes any value of type A and returns a value of some type B (or a promise of B).

A valid HttpHandler is defined as

```typescript
import { Request, Response } from "@ezapi/router-core";

type HttpHandler = Handler<Request, Response<string | Buffer>>;
```

A Middleware instance is just a construct that takes some handler, and transforms it to another type of handler.

For example, the `JsonMiddleware` takes some type of HttpHandler: `Handler<Request & {jsonBody: unknown}, unknown>` and translates it into a vanilla `Handler<Request, Response>` type.

To formalise this, a very close approximation of the `Middleware` type can defined as:

```typescript
type Middleware<InA, InB, OutA, OutB> = (
  handler: Handler<InA & InB, OutR2>
) => Handler<InA, OutR1>;
```

This may seem a little confusing at first. So as an example, lets look at how we might implement the `JsonMiddleware`.

```typescript
// Here is a type that satisfies what we want to do.
// We'll take a handler that expects a Request object with a `jsonBody` property, and returns a response with some unknown body type.
// Our middleware will be responsible for:
// 1. providing this {jsonBody: unknown} to the jsonHandler
// 2. translating the `unknown` body type returned from `jsonHandler` to a string or a Buffer.
type JsonMiddleware = (
  jsonHandler: Handler<Request & { jsonBody: unknown }, Response<unknown>>
) => Handler<Request, Response<string | Buffer>>;

// Following the types might give us something like this
const jsonMiddleware: JsonMiddleware =
  (jsonHandler) => async (originalRequest) => {
    const originalBody = originalRequest.body;
    let jsonBody: unknown = {};
    try {
      jsonBody = JSON.parse(originalBody);
    } catch {
      return BadRequest("Bad JSON");
    }
    const jsonResponse = await jsonHandler({ ...originalRequest, jsonBody });
    const stringBody = JSON.stringify(jsonResponse.body);
    return { ...jsonResponse, body: stringBody };
  };
```

:::danger This wont actually work

This is demonstrative only.
The above may compile, but will fail if you try and plug it in to the RouterBuilder. EZAPI provides some syntax sugar for implementing middleware. Use that instead.

:::
