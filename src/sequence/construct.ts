export default function* construct<T>(
  ctor: (index: number) => T,
  count?: number
) {
  let index = 0;

  // Split into a regular and infinite loop to avoid checking count === undefined on every iteration
  if (count === undefined) {
    while (true) {
      yield ctor(index++);
    }
  } else {
    while (index < count) {
      yield ctor(index++);
    }
  }
}
