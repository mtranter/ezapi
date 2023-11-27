import {
  HttpMethod,
  Router,
  Response as CoreResponse,
  Body,
} from "@ezapi/router-core";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type NextJsMiddlewareConfig = {
  return404OnNotFound: boolean;
};

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

const queryStringToQueryObject = (queryString: string) => {
  const queryObject: Record<string, string> = {};
  queryString
    .split("&")
    .map((kv) => kv.split("="))
    .forEach(([k, v]) => {
      queryObject[k] = v;
    });
  return queryObject;
};

export const NextJsMiddleware =
  (router: Router, { return404OnNotFound }: NextJsMiddlewareConfig) =>
  async (req: NextRequest) => {
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });
    const body = await req.blob().then(async (blob) => {
      return Buffer.from(await blob.arrayBuffer());
    });
    const response = await router
      .run({
        method: req.method as HttpMethod,
        url: req.nextUrl.pathname,
        query: queryStringToQueryObject(req.url.split("?")[1] ?? ""),
        headers,
        body,
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
      const body = await bodyToString(response.body)
      return new NextResponse(body, {
        status: response.statusCode,
        headers: response.headers,
      });
    } else if (return404OnNotFound) {
      return new NextResponse(null, {
        status: 404,
        headers: {},
      });
    } else {
      return NextResponse.next();
    }
  };
