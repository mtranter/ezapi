import { expressMiddleware, applyPrequisites } from "@ezapi/express-backend";
import express from "express";
import { PeopleService } from "./people-service";
import { routes } from "./routes";

const mw = expressMiddleware(routes(PeopleService()), true);

const app = express();
applyPrequisites(app);
app.use(mw);

app.listen(5051, () => {
  console.log("listening on 5051");
});
