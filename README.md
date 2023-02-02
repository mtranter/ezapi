# EZAPI

Yet Another Typescript Web API DSL.

## Features

- Strongly typed
- Composable Middleware. Included in this repo:
  - JSON parsing (@ezapi/json-middleware)
  - Zod request validation (@ezapi/zod-middleware)
- Pluggable backends. Included in this repo:
  - AWS API Gateway REST API (@ezapi/aws-rest-api-backend")
  - AWS API Gateway HTTP API (@ezapi/aws-http-api-backend")
  - Express (@ezapi/express-backend)

## How To:

#### Install
`$> npm install --save @ezapi/router-core @ezapi/json-middleware @ezapi/zod-middleware @ezapi/<your>-backend`

#### Routes:

```typescript
// routes.ts
import { RouteBuilder, Ok, NotFound, Created } from "@ezapi/router-core";
import { JsonParserMiddlerware } from "@ezapi/json-middleware";
import { ZodMiddleware } from "@ezapi/zod-middleware";
import { z } from "zod";
import { peopleService } from "./people-service";

const PersonRequestProps = {
  name: z.string(),
};

const PersonRequestSchema = z.object(PersonRequestProps);

const PersonSchema = z.object({
  id: z.number(),
  ...PersonRequestProps,
});

export const routes = () =>
  RouteBuilder.withMiddleware(JsonParserMiddlerware())
    .route("GET", "/people/{id:int}")
    .handle(async (request) => {
      // request.pathParams is of type: { id: number }
      const person = await peopleService.getPerson(request.pathParams.id);
      return person
        ? Ok(person)
        : NotFound(`Person ${r.pathParams.id} not found`);
    })
    .route("GET", "/people/name/{name}")
    .handle(async (r) => {
      const person = await peopleService.getPeopleByName(r.pathParams.name);
      return Ok(person);
    })
    .route("PUT", "/people", ZodMiddleware(PersonRequestSchema, PersonSchema))
    .handle(async (req) => {
      // Zod middleware adds {safeBody: {name: string}} to request type and runtime value
      const newPerson = await peopleService.putPerson(req.safeBody);

      // Zod middleware forces handler function to return a type compatable with PersonSchema
      return Ok(newPerson);
    })
    .build();
```

#### Backends:

##### Express

```typescript
// index.ts
import { expressMiddleware } from "@ezapi/express-backend";
import express from "express";
import bodyParser from "body-parser";
import { routes } from "./routes";

const ezApiMiddleware = expressMiddleware(routes(), true);

const app = express();
// Ezapi expres backend requires raw body parser
app.use(bodyParser.raw({ inflate: true, limit: "100kb", type: "*/*" }));
app.use(ezApiMiddleware);

app.listen(5051, () => {
  console.log("listening on 5051");
});
```

##### AWS HTTP API

```typescript
import { httpApiHandler } from "@ezapi/aws-http-api-backend";
import { routes } from "./routes";

const apiStage = "live";
export const handler = httpApiHandler(routes(), apiStage);
```

##### AWS REST API

```typescript
import { restApiHandler } from "@ezapi/aws-rest-api-backend";
import { routes } from "./routes";

const apiStage = "live";
export const handler = restApiHandler(routes(), apiStage);
```
