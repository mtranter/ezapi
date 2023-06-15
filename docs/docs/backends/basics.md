---
sidebar_position: 2
slug: ez-api-backends
description: EZAPI Backends
title: Basics
---

### Backend Basics

EZApi is simply a routing DSL. It is designed to be plugable by any web backend.

EZApi currently ships with express, AWS Rest API GW and AWS HTTP API GW backends.

#### Express Backend

```typescript
import { expressMiddleware } from "@ezapi/express-backend";
import express from "express";
import bodyParser from "body-parser";
import { routes } from "./routes";

const mw = expressMiddleware(routes, {
  return404IfRouteNotFound: true,
});

const app = express();

// EZApi requires the Raw body parser
app.use(bodyParser.raw({ inflate: true, limit: "100kb", type: "*/*" }));
app.use(mw);

app.listen(5051, () => {
  console.log("listening on 5051");
});
```

### Create a backend

The `Router` instance has a simple `run` function that makes it trivial to implement your own backend.

See the examples in GitHub for more guidance.


```typescript
type RouterRunArgs = {
  method: string,
  url: string,
  headers: Record<string, string | string[]>,
  body: string | Buffer,
  query: Record<string, string | string[]>,
}

type Router = {
  run: (args: RouterRunArgs): Promise<Response<string | Buffer>>
}

```

