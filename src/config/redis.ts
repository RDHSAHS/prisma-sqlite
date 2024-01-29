import { createClient } from "redis";
import type { RedisClientType } from "redis";
import { ENV } from "../constant";

export let redisClient: RedisClientType;

(async () => {
  redisClient = createClient({
    url: ENV.REDIS_URL,
  });

  redisClient.on("error", (err) => console.log("Redis client eror", err));
  await redisClient.connect();
})();
