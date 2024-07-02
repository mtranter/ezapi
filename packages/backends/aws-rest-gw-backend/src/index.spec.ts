import { RouteBuilder } from "@ezapi/router-core";
import { restApiHandler } from ".";

const testEvent = {
  resource: "/{proxy+}",
  path: "/__healthcheck",
  httpMethod: "GET",
  headers: {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  },
  multiValueHeaders: {},
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: { proxy: "__healthcheck" },
  stageVariables: null,
  requestContext: {
    resourceId: "zwv7gq",
    resourcePath: "/{proxy+}",
    httpMethod: "GET",
    extendedRequestId: "aRNEtHgMSwMEMqg=",
    requestTime: "02/Jul/2024:05:23:54 +0000",
    path: "/prod/__healthcheck",
    accountId: "340502884936",
    protocol: "HTTP/1.1",
    stage: "prod",
    domainPrefix: "w8vxp7hj6l",
    requestTimeEpoch: 1719897834645,
    requestId: "95ce6e75-2752-476d-9671-307c6870bcba",
    domainName: "w8vxp7hj6l.execute-api.ap-southeast-2.amazonaws.com",
    deploymentId: "6w6cw9",
    apiId: "w8vxp7hj6l",
  },
  body: null,
  isBase64Encoded: false,
} as const;
describe("AWS REST Gateway Backend", () => {
  const routes = RouteBuilder
    .route("healthcheck", "GET", "/__healthcheck")
    .build({
    healthcheck: async () => {
      return {
        statusCode: 200,
        body: "OK",
      };
    },
  });
  const sut = restApiHandler(routes, "prod");
  it("should return the correct response", async () => {
    const response = await sut(testEvent as any, {} as any, null as any)
    expect(response).toEqual({
      statusCode: 200,
      body: "OK",
    });
  });
});
