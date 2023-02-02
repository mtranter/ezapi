import { RouteBuilder, Ok, NotFound, Created } from "@ezapi/router-core";
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

export const routes = (svc: PeopleService) =>
  RouteBuilder.withMiddleware(JsonParserMiddlerware())
    .route("GET", "/people/{id:int}")
    .handle(async (r) => {
      const person = await svc.getPerson(r.pathParams.id);
      return person
        ? Ok(person)
        : NotFound(`Person ${r.pathParams.id} not found`);
    })
    .route("GET", "/people/name/{name}")
    .handle(async (r) => {
      const person = await svc.getPeopleByName(r.pathParams.name);
      return Ok(person);
    })
    .route("POST", "/people", ZodMiddleware(PersonRequestSchema, PersonSchema))
    .handle(async (req) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newPerson = await svc.putPerson(req.jsonBody as any);
      return Created(newPerson, `/people/${newPerson.id}`);
    })
    .route("PUT", "/people", ZodMiddleware(PersonSchema, PersonSchema))
    .handle(async (req) => {
      const newPerson = await svc.putPerson(req.safeBody);
      return Ok(newPerson);
    })
    .build();
