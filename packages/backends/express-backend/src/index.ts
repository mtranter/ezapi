import {
  HttpMethod,
  Response as CoreResponse,
  Router,
  Body,
} from "@ezapi/router-core";
import { Request as ExpRequest, Response, NextFunction } from "express";

type ExpressMiddleware = (
  req: ExpRequest,
  res: Response,
  next: NextFunction
) => void;

export const expressMiddleware = (
  router: Router | Promise<Router>,
  cfg: { return404IfRouteNotFound: boolean }
): ExpressMiddleware => {
  return async (req, res, next) => {
    const routerInstance = await router;
    const response = await routerInstance
      .run({
        method: req.method.toUpperCase() as HttpMethod,
        url: req.path,
        body: req.body as string,
        headers: req.headers,
        query: req.query as Record<string, string | undefined>,
      })
      .catch((e) => {
        console.error(e);
        return {
          statusCode: 500,
          headers: {},
          body: "Internal Server Error",
        } as CoreResponse<Body>;
      });
    if (response) {
      res.status(response?.statusCode);
      Object.keys(response.headers ?? {}).forEach((h) =>
        res.set(h, (response.headers ?? {})[h])
      );
      if (
        response.body instanceof Buffer ||
        typeof response.body === "string"
      ) {
        res.send(response.body);
      } else {
        response.body?.pipe(res);
      }
      return;
    }
    return cfg.return404IfRouteNotFound
      ? (() => res.status(404).send())()
      : next();
  };
};
