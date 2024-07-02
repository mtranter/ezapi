import {
  RouteBuilder,
  Ok,
  NotFound,
  Created,
  HandlersOf,
  HttpMiddleware,
  ApiBuilder,
  PassThrough,
  Unauthorized,
  Body,
} from "@ezapi/router-core";
import { JsonParserMiddlerware } from "@ezapi/json-middleware";
import { ZodMiddleware } from "@ezapi/zod-middleware";
import { z } from "zod";
import { PeopleService } from "./people-service";

const PersonRequestProps = {
  name: z.string(),
};

const PersonRequestSchema = z.object(PersonRequestProps);

const PersonSchema = z.object({
  id: z.number(),
  ...PersonRequestProps,
});

export const LoggingMiddleware = HttpMiddleware.of(
  async (originalRequest, handler) => {
    console.log(`Request`, originalRequest);
    const response = await handler(originalRequest);
    console.log(`Response`, response);
    return response;
  }
);

export const routeDefinition = RouteBuilder.withMiddleware(
  JsonParserMiddlerware
)
  .withMiddleware(LoggingMiddleware)
  .route("getPersonById", "GET", "/{id:int}")
  .route("getPersonByName", "GET", "/name/{name}")
  .route(
    "postPerson",
    "POST",
    "/",
    ZodMiddleware(PersonRequestSchema, PersonSchema)
  )
  .route(
    "putPerson",
    "PUT",
    "/{id:int}",
    ZodMiddleware(PersonSchema, PersonSchema)
  );

type RouteHandlers = HandlersOf<typeof routeDefinition>;

const handlers = (svc: PeopleService): RouteHandlers => ({
  getPersonById: async (r) => {
    const person = await svc.getPerson(r.pathParams.id);

    return person
      ? Ok(person)
      : NotFound(`Person ${r.pathParams.id} not found`);
  },
  getPersonByName: async (r) => {
    const person = await svc.getPeopleByName(r.pathParams.name);
    return Ok(person);
  },
  postPerson: async (req) => {
    console.log(JSON.stringify(req));
    const newPerson = await svc.putPerson(req.safeBody);
    return Created(newPerson, `/people/${newPerson.id}`);
  },
  putPerson: async (req) => {
    const newPerson = await svc.putPerson(req.safeBody);
    return Ok(newPerson);
  },
});

export const routes = (pplService: PeopleService) =>
  ApiBuilder.build({ "/people": routeDefinition.build(handlers(pplService)) });
