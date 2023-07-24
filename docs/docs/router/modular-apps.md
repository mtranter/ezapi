---
sidebar_position: 3
title: Modular Apps
slug: ez-api-modular-routing
---

# Modular Applications

It can be cumbersome to use a single Router/RouterBuilder instance for large web apps.

Use the `ApiBuilder` object to modularise your API Routes.

The below example shows two router setups, 

```typescript
// people.ts
const peopleRoutes = RouteBuilder.route(
  "searchPeople",
  "GET",
  "/?{name}&{age:int}"
);
export const peopleRouter = peopleRoutes.build({
  searchPeople: async (req) => {
    const nameQuery: string = req.queryParams.name;
    const ageQuery: number = req.queryParams.age;
    return Ok(JSON.stringify({ nameQuery, ageQuery }));
  },
});

// cars.ts
const carRoutes = RouteBuilder.route("searchCars", "GET", "/?{make}&{model}");
export const carRouter = carRoutes.build({
  searchCars: async (req) => {
    const makeQuery = req.queryParams.make;
    const modelQuery = req.queryParams.model;
    return Ok(JSON.stringify({ makeQuery, modelQuery }));
  },
});

// api.ts
import { peopleRouter } from './people.ts'
import { carRouter } from './cars.ts'
const api: Router = ApiBuilder.build({
  "/people": peopleRouter,
  "/cars": carRouter,
});
```


The API builder takes a Record of "/" prefixes to Router instances or router arrays.

e.g.
```typescript
import { peopleRouter } from './people.ts'
import { carRouter } from './cars.ts'
import { moreCarRoutes } from './more-cars.ts'
const api: Router = ApiBuilder.build({
  "/people": peopleRouter,
  "/cars": [carRouter, moreCarRoutes],
});