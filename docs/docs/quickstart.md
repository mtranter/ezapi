---
sidebar_position: 1
---

# Quickstart

## Getting Started

### Install

`npm install -S @ezapi/router-core @ezapi/express-backend`

### DSL

The DSL is super simple. Heres an example using an Express JS Backend

```typescript
import { expressMiddleware } from "@ezapi/express-backend";
import express from "express";
import bodyParser from "body-parser";
import { RouteBuilder, Ok } from "@ezapi/router-core";

const api = RouteBuilder
  .route("pingPong", "GET", "/ping")
  .route("helloWorld", "GET", "/hello-{name}")
  .build({
    pingPong: req => Ok('PONG!'),
    helloWorld: req => Ok(`Hello, ${req.pathParams.name}!`) // <- strongly typed pathParams
  })

const expressMW = expressMiddleware(api, true);

const app = express();
// EZ API requires the raw body parser
app.use(bodyParser.raw({ inflate: true, limit: "100kb", type: "*/*" }));
app.use(expressMW);

app.listen(5051, () => {
  console.log("listening on 5051");
});

```