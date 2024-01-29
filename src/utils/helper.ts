import { randomBytes } from "crypto";

export class Helper {
  generateRandomString(length: number) {
    return randomBytes(length).toString("hex").slice(0, 3);
  }
}
