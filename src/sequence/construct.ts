import invariant from 'tiny-invariant';

export default function construct<T>(
  ctor: (index: number) => T,
  count?: number
): Generator<T> {
  let index = 0;

  // Split into a regular and infinite loop to avoid checking count === undefined on every iteration
  if (count === undefined) {
    return (function* () {
      while (true) {
        yield ctor(index++);
      }
    })();
  } else {
    invariant(count >= 0, 'Item count cannot be negative');
    invariant(Number.isSafeInteger(count), 'Count must be a safe integer');
    return (function* () {
      while (index < count) {
        yield ctor(index++);
      }
    })();
  }
}
