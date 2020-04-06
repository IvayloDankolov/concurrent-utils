export default function* repeat<T>(item: T, count?: number) {
  // Split into a regular and infinite loop to avoid checking count === undefined on every iteration
  // and initialising a counting index.
  if (count === undefined) {
    while (true) {
      yield item;
    }
  } else {
    for (let index = 0; index < count; ++index) {
      yield item;
    }
  }
}
