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

Middleware instances are simple to understand. They act as handler decorators, allowing you to add functionality before and/or after the handler is executed. You can also provide extra arguments to the wrapped handler or modify the output of the handler as needed.

### A more complex example - Composition

EZApi middleware are composable and type safe. Composability just means that we can stack two different middleware instances together and have the type checker prove that this is safe.

A metaphor here is simple function composition. If we have some function `fab: A => B` and a function `fbc: B => C`, we can safely compose these together for form the function `fac: A => C`.

To easily allow building middleware that satisfy typesafe composition, the `HttpMiddleware.of` function is of a fairly complex generic type.

```typescript

const Middleware = {
  of: <InputToNewHandler, InputToWrappedHandler, OutputFromNewHandler, OutputFromWrappedHandler>
}
```

In this example, we'll look at building a middleware instance that depends on a previous middleware being added to the middleware chain. 

Specifically, our middleware will make a call to an OAuth `/userinfo` endpoint to obtain the ID Token details from some OAuth server. This middleware will depend on the JWT token having already been validated - say by the `@ezapi/jwt-middleware` instance.

```typescript

const IdMiddleware = <Response>() =>
  HttpMiddleware.of<{ jwtToken: string }, { username: string }, Response, Response>(
    async (orginalRequest, wrappedHandler) => {
      const token = orginalRequest.jwtToken;
      const idClaims = await fetch(
        "https://api.my-auth-provider/oauth2/token",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((resp) => resp.json());
      const username = idClaims.username;
      return wrappedHandler({ ...orginalRequest, username });
    }
  );

```