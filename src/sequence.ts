import invariant from 'tiny-invariant';

export function numeric(
  opts: {
    from?: number;
    to?: number;
    step?: number;
  } = {}
): Generator<number> {
  const step = opts.step ?? 1;
  const end = opts.to;

  let curr = opts.from ?? 0;

  invariant(
    step != 0,
    'Numeric sequence step cannot be 0. This is usually a code smell for a miscalculated step. If you were actually to repeat the same numebr infinitely, consider using sequence.repeat or sequence.construct'
  );

  invariant(
    isFinite(curr) && isFinite(step) && isFinite(end ?? 0),
    'All 3 arguments must be finite numbers.'
  );

  // Split into a regular and infinite loop to avoid checking end === undefined on every iteration
  if (end === undefined) {
    return (function* () {
      while (true) {
        yield curr;
        curr += step;
      }
    })();
  } else {
    // Do the step check outside the generator for maximum performance on the hot path.
    if (step > 0) {
      return (function* () {
        while (curr <= end) {
          yield curr;
          curr += step;
        }
      })();
    } else {
      return (function* () {
        while (curr >= end) {
          yield curr;
          curr += step;
        }
      })();
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
