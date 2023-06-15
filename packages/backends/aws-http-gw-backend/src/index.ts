import { HttpMethod, Router } from "@ezapi/router-core";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

const base64Decode = (s: string) => Buffer.from(s, "base64").toString("utf8");

export const httpApiHandler = (
  router: Router | Promise<Router>,
  stageName: string
): APIGatewayProxyHandlerV2 => {
  return async (req) => {
    const routerInstance = await router;
    const response = await routerInstance.run({
      method: req.requestContext.http.method.toUpperCase() as HttpMethod,
      url: req.requestContext.http.path.replace(`/${stageName}`, ""),
      body: req.isBase64Encoded ? base64Decode(req.body as string) : req.body,
      headers: req.headers,
      query: req.queryStringParameters || {},
    });
    if (response) {
      return {
        statusCode: response.statusCode,
        headers: response.headers,
        body: response.body.toString(),
      };
    }
    return {
      statusCode: 404,
      body: "Not Found",
    };
  };
};
