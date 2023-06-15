import { Router } from "@ezapi/router-core";
import * as http from "http";

const requestBodyToString = (body: http.IncomingMessage): Promise<string> => {
  return new Promise((resolve, reject) => {
    let data = "";
    body.on("data", (chunk) => {
      data += chunk;
    });
    body.on("end", () => {
      resolve(data);
    });
    body.on("error", (e) => {
      reject(e);
    });
  });
};

const parseUrlQuery = (url: string): Record<string, string | undefined> => {
  const query: Record<string, string | undefined> = {};
  const queryStart = url.indexOf("?");
  if (queryStart === -1) {
    return query;
  }
  const queryStr = url.slice(queryStart + 1);
  queryStr.split("&").forEach((pair) => {
    const [key, value] = pair.split("=");
    query[key] = value;
  });
  return query;
};

export const VanillaBackend = (router: Router) =>
  http.createServer(async (req, res) => {
    const body = await requestBodyToString(req);
    router
      .run({
        method: req.method as any,
        url: req.url?.split("?")[0] ?? "",
        body,
        headers: req.headers,
        query: parseUrlQuery(req.url ?? ""),
      })
      .then((response) => {
        if (response) {
          res.writeHead(response.statusCode, response.headers);
          res.end(response.body);
        } else {
          res.writeHead(404);
          res.end();
        }
      })
      .catch((e) => {
        console.error(e);
        res.writeHead(500);
        res.end("Internal Server Error");
      });
  });
