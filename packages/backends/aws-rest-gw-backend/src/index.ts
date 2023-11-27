import { HttpMethod, Router, Body } from "@ezapi/router-core";
import { APIGatewayProxyHandler } from "aws-lambda";


const readableStreamToString = (stream: NodeJS.ReadableStream): Promise<string> => {
  const chunks: Uint8Array[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}
const bodyToString = async (b: string | Buffer | NodeJS.ReadableStream): Promise<string> => {
  if (typeof b === "string") {
    return b;
  }
  if (Buffer.isBuffer(b)) {
    return b.toString("utf8");
  }
  else {
    return readableStreamToString(b);
  }
}

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
        body: response.body ? (await bodyToString(response.body)) : ""
      };
    }
    return {
      statusCode: 404,
      body: "Not Found",
    };
  };
};
