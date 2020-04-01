export function* numeric(start = 0, step = 1, end?: number) {
  let curr = start;

  // Split into a regular and infinite loop to avoid checking end === undefined on every iteration
  if (end === undefined) {
    while (true) {
      yield curr;
      curr += step;
    }
  } else {
    while (curr < end) {
      yield curr;
      curr += step;
    }
  }
}

export function* construct<T>(ctor: (index: number) => T, count?: number) {
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

export function* repeat<T>(item: T, count?: number) {
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
