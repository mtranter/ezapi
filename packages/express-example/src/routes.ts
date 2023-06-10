import {
  RouteBuilder,
  Ok,
  NotFound,
  Created,
  HandlersOf,
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

export const routeDefinition = RouteBuilder.withMiddleware(
  JsonParserMiddlerware.widen()
)
  .route("getPersonById", "GET", "/people/{id:int}")
  .route("getPersonByName", "GET", "/people/name/{name}")
  .route(
    "postPerson",
    "POST",
    "/people",
    ZodMiddleware(PersonRequestSchema, PersonSchema).widen()
  )
  .route(
    "putPerson",
    "PUT",
    "/people/{id}",
    ZodMiddleware(PersonSchema, PersonSchema).widen()
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
    const newPerson = await svc.putPerson(req.safeBody);
    return Created(newPerson, `/people/${newPerson.id}`);
  },
  putPerson: async (req) => {
    const newPerson = await svc.putPerson(req.safeBody);
    return Ok(newPerson);
  },
});

export const routes = (pplService: PeopleService) =>
  routeDefinition.build(handlers(pplService));
