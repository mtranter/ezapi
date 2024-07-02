import { Body, HttpMiddleware, PassThrough } from "@ezapi/router-core";
import mimeMatch from "mime-match";

const DEFAULT_MIME_TYPE = "application/json";

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

export const JsonParserMiddlerware = HttpMiddleware.of<
  PassThrough,
  { jsonBody: object },
  string,
  unknown
>(async (req, handler) => {
  const contentType = req.headers["content-type"];
  if (!mimeMatch(DEFAULT_MIME_TYPE, contentType as string)) {
    return {
      statusCode: 415,
      body: `Unsupported media type: ${contentType as string}`,
    };
  }
  let result: object = {};
  try {
    const body = req.body ? (await bodyToString(req.body)) : undefined
    result =
      body && body.length ? JSON.parse(body) : undefined;
  } catch (e) {
    console.log(e);
    return Promise.resolve({
      statusCode: 400,
      body: "Invalid JSON",
    });
  }
  const resp = await handler({ ...req, jsonBody: result });
  return {
    statusCode: resp.statusCode,
    body: JSON.stringify(resp.body),
    headers: {
      ...resp.headers,
      "content-type": "application/json; charset=utf-8",
    },
  };
});
