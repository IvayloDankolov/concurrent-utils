import invariant from 'tiny-invariant';

interface NumericOptions {
  /**
   * Starting number in the sequence.
   * @default 0
   */
  from?: number;
  /**
   * Ending point of the sequence, inclusive.
   *
   * For ascending sequences (`step > 0`), this is the *strict upper bound*.
   *
   * For descending ones (`step < 0`) it's the *strict lower bound* instead.
   *
   * If undefined it will result in an infinite generator
   * @default undefined
   */
  to?: number;
  /**
   * Gap between items.
   *
   * Must be non-zero and large enough to clear the floating point gap
   * at the two ends of the sequence so as not to cause infinite loops
   * (e.g. `1e100+1===1e100` and would thus be disallowed)
   *
   * If an infinite generator is required, that must be done done
   * by specificaly leaving `NumericOptions.to` as `undefined`.
   * @default 1
   */
  step?: number;
}
/**
 * Generates an arithmetic progression within the given limits.
 *
 * For positive step progressions, all items fall within the interval [start, end], or [start, +∞) for unbounded ones.
 * For negative step progressions, the end is treated as the lowest values, thus the bounds are
 *
 * @param opts The sequence parameters.
 *
 * @example
 * ```typescript
 * // Ascending
 * Array.from(numeric({from: 1, to: 10}))
 * // => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 *
 * // Descending
 * Array.from(numeric({from: 14, to: 1, step: -3}))
 * // => [14, 11, 8, 5, 2]
 *
 * // Infinite
 *
 * const evens = numeric({from: 2, step: 2});
 * console.log(events.next().value); // => 2
 * console.log(events.next().value); // => 4
 * console.log(events.next().value); // => 6
 * // We might be here for a while...
 * ```
 */
export default function numeric({
  from,
  to,
  step,
}: NumericOptions): Generator<number> {
  step = step ?? 1;
  let curr = from ?? 0;

  invariant(
    step != 0,
    'Numeric sequence step cannot be 0. This is usually a code smell for a miscalculated step. If you were actually to repeat the same numebr infinitely, consider using sequence.repeat or sequence.construct'
  );

  invariant(
    isFinite(curr) && isFinite(step) && isFinite(to ?? 0),
    'All 3 arguments must be finite numbers.'
  );

  invariant(
    curr + step !== curr,
    'Step must be large enough to clear the smallest gap in floating point numbers at the start of the sequence, and thus avoid infinite loops.'
  );

  // Split into a regular and infinite loop to avoid checking end === undefined on every iteration
  if (to === undefined) {
    return (function* () {
      while (true) {
        yield curr;
        curr += step;
      }
    })();
  } else {
    // Do the step check outside the generator for maximum performance on the hot path.
    if (step > 0) {
      invariant(
        to - step < to,
        'Step must be large enough to clear the smallest gap in floating point numbers at the end of the sequence, and thus avoid infinite loops.'
      );
      return (function* () {
        while (curr <= to) {
          yield curr;
          curr += step;
        }
      })();
    } else {
      invariant(
        to - step > to,
        'Step must be large enough to clear the smallest gap in floating point numbers at the end of the sequence, and thus avoid infinite loops.'
      );
      return (function* () {
        while (curr >= to) {
          yield curr;
          curr += step;
        }
      })();
    }
  }
}
