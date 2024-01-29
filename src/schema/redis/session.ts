import { Repository, Schema } from "redis-om";
import { redisClient } from "../../config";

const sessionSchema = new Schema(
  "session",
  { uuid: { type: "string" } },
  { dataStructure: "HASH" }
);

export const sessionRepository = new Repository(sessionSchema, redisClient);
