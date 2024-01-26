import { genSalt, hash, compare } from "bcryptjs";

export const hashPassword = async (password: string) => {
  const salt = await genSalt(5);
  const hashedPass = await hash(password, salt);
  return hashedPass;
};

export const verivyPassword = async (password: string, hashedPass: string) => {
  const isValid = await compare(password, hashedPass);
  return isValid;
};
