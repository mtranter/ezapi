import { HttpMethod, Router, BackendUtils } from "@ezapi/router-core";
import { Request as ExpRequest, Response, NextFunction } from "express";

type ExpressMiddleware = (
  req: ExpRequest,
  res: Response,
  next: NextFunction
) => void;

export const expressMiddleware = (
  router: Router | Promise<Router>,
  or404: boolean
): ExpressMiddleware => {
  return async (req, res, next) => {
    const routerInstance = await router;
    const handler = BackendUtils.buildHandler(routerInstance);
    const response = await handler({
      method: req.method.toUpperCase() as HttpMethod,
      url: req.path,
      body: req.body as string,
      headers: req.headers,
      query: req.query as Record<string, string | undefined>,
    });
    if (response) {
      res.status(response?.statusCode);
      Object.keys(response.headers ?? {}).forEach((h) =>
        res.set(h, (response.headers ?? {})[h])
      );
      res.send(response.body);
      return;
    }
    return or404 ? (() => res.status(404).send())() : next();
  };
};
