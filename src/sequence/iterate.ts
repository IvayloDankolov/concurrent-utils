export function iterate<T, Args extends T[]>(
  initialValues: Args,
  stepFunction: (...args: Args) => T,
  count?: number
): Generator<T> {
  const buffer = initialValues.concat();

  if (count != null) {
    return (function* () {
      let current = 0;
      for (const val of buffer) {
        if (current >= count) {
          return;
        }
        yield val;
        current++;
      }

      for (; current < count; ++current) {
        const next = stepFunction(...(<Args>buffer));
        yield next;
        buffer.splice(0, 1);
        buffer.push(next);
      }
    })();
  } else {
    return (function* () {
      for (const val of buffer) {
        yield val;
      }

      while (true) {
        // Type system can't guarantee we're using the same size tuple here
        const next = stepFunction(...(<Args>buffer));
        yield next;
        buffer.splice(0, 1);
        buffer.push(next);
      }
    })();
  }
}
