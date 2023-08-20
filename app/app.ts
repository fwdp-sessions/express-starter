import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import config from "config";
import { bootstrap } from "./server";

process.env.TZ = "Asia/Manila";

const port = config.get<number>("port");
export const App = () => {
  bootstrap().listen(port, () => {
    console.log(
      "Server started at" + ` ${new Date().toLocaleString()} ` + "🔥"
    );
    console.log("Server listening on port " + port + "🚀");
  });
};
