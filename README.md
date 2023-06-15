# EZAPI

Yet Another Typescript Web API DSL.

## Features

- Strongly typed
- Seperate route definitions from implementations. Easy Testing! Hooray!!
- Composable Middleware. Included in this repo:
  - JSON parsing (@ezapi/json-middleware)
  - Zod request validation (@ezapi/zod-middleware)
- Pluggable backends. Included in this repo:
  - AWS API Gateway REST API (@ezapi/aws-rest-api-backend")
  - AWS API Gateway HTTP API (@ezapi/aws-http-api-backend")
  - Express (@ezapi/express-backend)

## Docs:

Full docs here: https://mtranter.github.io/ezapi/quickstart

## Quickstart

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