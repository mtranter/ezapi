---
sidebar_position: 1
title: Basic Routing
slug: ez-api-basic-routing
---

# Basic Routing

The DSL for EZ API is designed to be simple, intuitive, and type-safe.

EZ API intentionally separates the route definitions from the handling of the routes.

A basic route definition might look like this:

```typescript
import { RouteBuilder, Ok } from "@ezapi/router-core";

const routeDefinitions = RouteBuilder.route("pingPong", "GET", "/ping");
```

This route definition defines a single simple route named "pingPong". It models a `GET` request to the path `/ping`.

The `build()` function on the RouteBuilder takes an object that maps route names to handlers. 
This is strongly typed and will fail to compile if the appropriate handler is not supplied.

```typescript
routeDefinitions.build({
  pingPong: (req) => Ok("PONG!"),
});
```
