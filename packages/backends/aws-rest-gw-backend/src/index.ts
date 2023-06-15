import { HttpMethod, Router } from "@ezapi/router-core";
import { APIGatewayProxyHandler } from "aws-lambda";

export const restApiHandler = (
  router: Router | Promise<Router>,
  stageName: string
): APIGatewayProxyHandler => {
  return async (req) => {
    const routerInstance = await router;
    const response = await routerInstance.run({
      method: req.httpMethod.toUpperCase() as HttpMethod,
      url: req.path.replace(`/${stageName}`, ""),
      body: req.body as string,
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
