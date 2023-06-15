---
sidebar_position: 2
slug: ez-api-custom-middleware
description: EZAPI Custom Middleware
title: Custom Middleware
---

# Custom Middleware

Writing your own middleware is a possible using the `HttpMiddleware` functions supplied in the `@ezapi/router-core` package.

### Simple Example - Logging

You can create a middleware that logs all requests and responses using the following code:

```typescript
import { HttpMiddleware } from "@ezapi/router-core";

export const LoggingMiddleware = HttpMiddleware.of(
  async (originalRequest, handler) => {
    console.log(`Request`, originalRequest);
    const response = handler(originalRequest);
    console.log(`Response`, response);
    return response;
  }
);
```

The `LoggingMiddleware` is an example of a middleware that logs information before and after executing the handler. In this case, it logs the original request and the response.

Middleware can be thought of as handler decorators, allowing you to add functionality before and/or after the handler is executed. You can also provide extra arguments to the wrapped handler or modify the output of the handler as needed.

### A more complex example - Composition

EZApi middleware is composable and type-safe. Composability means that you can stack multiple middleware instances together, and the type checker will ensure that it's done safely.

A metaphor for this is function composition, where you can safely compose functions `fab: A => B` and `fbc: B => C` to form the function `fac: A => C`.

To facilitate building middleware that satisfies type-safe composition, the `HttpMiddleware.of` function has a complex generic type signature:

```typescript

const Middleware = {
  of: <InputToNewHandler, InputToWrappedHandler, OutputFromNewHandler, OutputFromWrappedHandler>
}
```

In this example, we'll demonstrate building a middleware instance that depends on a previous middleware being added to the middleware chain.

Specifically, our middleware will make a call to an OAuth `/userinfo` endpoint to obtain the ID Token details from an OAuth server. This middleware will depend on the JWT token having already been validated, for example, by using the `@ezapi/jwt-middleware` instance.

```typescript
const IdMiddleware = <Response>() => {
  type JsonMiddlewareInjectedProps = { jwtToken: string }; // type we expect to be provided
  type IdMiddlewareInjectedProps = { username: string }; // additional props that we will provide
  HttpMiddleware.of<
    JsonMiddlewareInjectedProps,
    IdMiddlewareInjectedProps,
    Response, // agnostic of response
    Response // agnostic of response
  >(async (orginalRequest, wrappedHandler) => {
    const token = orginalRequest.jwtToken;
    const idClaims = await fetch("https://api.my-auth-provider/oauth2/token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((resp) => resp.json());
    const username = idClaims.username;
    return wrappedHandler({ ...orginalRequest, username });
  });
};
```

The `IdMiddleware` function is designed to be agnostic of the response type. To achieve this, we need to provide the response type as a generic parameter when calling `IdMiddleware()`. This allows TypeScript to infer the correct response type when using `withMiddleware(IdMiddleware())`.

### Deep Dive

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

```typescript
type Middleware<InA, InB, OutA, OutB> = (
  handler: Handler<InA & InB, OutR2>
) => Handler<InA, OutR1>;
```

For example, the `JsonMiddleware` takes some type of HttpHandler: `Handler<Request & {jsonBody: unknown}, unknown>` and translates it into a vanilla `Handler<Request, Response>` type.

The inspiration for this abstraction comes from the Scala library Http4s: https://http4s.org/v0.21/middleware/