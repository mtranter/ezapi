import { VanillaBackend } from "@ezapi/vanilla-backend";
import { PeopleService } from "./people-service";
import { routes } from "./routes";

const server = VanillaBackend(routes(PeopleService()));
server.listen(3031)