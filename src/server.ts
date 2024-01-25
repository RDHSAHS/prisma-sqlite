import express from "express";
import * as dotenv from "dotenv";
import root from "./routes";

async function main() {
  dotenv.config();

  const app = express();

  app.use(express.json({ limit: "3mb" }));
  app.use(express.urlencoded({ extended: true, limit: "3mb" }));

  //routes
  app.use(root);

  app
    .listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log("Server Up and Running at Port:" + Number(process.env.PORT));
    })
    .setTimeout(20 * 60 * 1000); //Set timeout to 20 Minutes
}

main().catch((e) => {
  console.error(e.message);
});
