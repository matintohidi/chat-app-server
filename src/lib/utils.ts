export function EnsureIsArray(input: unknown) {
  if (Array.isArray(input)) {
    return input;
  } else if (!!input) {
    return [input];
  }
}
