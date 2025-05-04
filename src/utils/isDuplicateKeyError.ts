/* eslint-disable operator-linebreak */
export default function isDuplicateKeyError(
  err: unknown
): err is { code: number } {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as any).code === 11000
  );
}
