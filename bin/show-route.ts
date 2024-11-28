import { showRoutes } from "hono/dev";

import { appRoute } from "../server/app";

export default showRoutes(appRoute);
