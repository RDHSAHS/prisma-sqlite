import jwt from "jsonwebtoken";
import { ENV } from "../constant";

export function parseJWT(token: string) {
  return jwt.verify(token.replace("Bearer ", ""), ENV.ACCESS_TOKEN as string);
}

export function tokenJWT(data: object) {
  return jwt.sign(data, ENV.ACCESS_TOKEN as string, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
}
