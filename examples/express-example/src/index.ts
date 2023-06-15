import { expressMiddleware } from "@ezapi/express-backend";
import express from "express";
import bodyParser from "body-parser";
import { PeopleService } from "./people-service";
import { routes } from "./routes";

const mw = expressMiddleware(routes(PeopleService()), true);

const app = express();
app.use(bodyParser.raw({ inflate: true, limit: "100kb", type: "*/*" }));
app.use(mw);

app.listen(5051, () => {
  console.log("listening on 5051");
});
