import JSONbig from "json-bigint";

export function convertBigInt(data: any) {
  return JSONbig.parse(JSONbig.stringify(data));
}
