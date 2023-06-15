---
sidebar_position: 2
slug: ez-api-backends
description: EZAPI Backends
title: Basics
---

### Backend Basics

EZApi is simply a routing DSL. It is designed to be plugable by any web backend.

EZApi currently ships with express, AWS Rest API GW and AWS HTTP API GW backends.

The `Router` instance has a simple `run` function.

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

This makes it trivial to implement your own backend. 

See the examples in GitHub for more guidance