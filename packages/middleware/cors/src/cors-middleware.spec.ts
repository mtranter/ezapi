import { CorsMiddleware } from ".";

describe("CorsMiddleware", () => {
  it("should return 200 OK with CORS headers", async () => {
    const handler = jest.fn(() => ({
      statusCode: 200,
      body: "OK",
    }));
    const cors = CorsMiddleware({
      allowedOrigins: ["https://example.com"],
      allowedMethods: ["GET", "POST"],
      allowedHeaders: ["X-Header"],
      exposedHeaders: ["X-Header"],
      allowCredentials: true,
      maxAge: 86400,
    });
    const response = await cors(handler)({
      method: "OPTIONS",
      url: "/",
      headers: {
        origin: "https://example.com",
        "access-control-request-method": "GET",
        "access-control-request-headers": "X-Header",
      },
    });
    expect(response).toEqual({
      statusCode: 200,
      body: "OK",
      headers: {
        "access-control-allow-origin": "https://example.com",
        "access-control-allow-methods": "GET,POST",
        "access-control-allow-headers": "X-Header",
        "access-control-expose-headers": "X-Header",
        "access-control-allow-credentials": "true",
        "access-control-max-age": "86400",
        vary: "origin",
      },
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should return 200 OK when Origin is not present", async () => {
    const handler = jest.fn(() => ({
      statusCode: 200,
      body: "OK",
    }));
    const cors = CorsMiddleware({
      allowedOrigins: ["https://example.com"],
      allowedMethods: ["GET", "POST"],
      allowedHeaders: ["X-Header"],
      exposedHeaders: ["X-Header"],
      allowCredentials: true,
      maxAge: 86400,
    });
    const response = await cors(handler)({
      method: "GET",
      headers: {},
      url: "/",
    });
    expect(response).toEqual({
      statusCode: 200,
      body: "OK",
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
