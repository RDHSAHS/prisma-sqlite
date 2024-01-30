import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.any().transform((d) => parseInt(d)),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  ACCESS_TOKEN: z.string(),
  AMQP_URL: z.string(),
});

export const ENV = envSchema.parse(process.env);
