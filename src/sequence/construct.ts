import invariant from 'tiny-invariant';

/**
 * Creates a sequence of items resulting from repeatedly calling a 'constructor' function as many times as specified.
 * @template T type of each item in the sequence
 * @param ctor A 'constructor' function that optionally takes the current index in the sequence and returns a `T`
 *  which will become the next element in the sequence.
 * @param count Total number of items to construct. Must be a
 *  [safe integer]({@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger})
 *  and non-negative.
 *
 *  If left undefined, the resulting sequence will be infinite.
 *
 * @example
 * ```typescript
 * construct(i => i, 5);
 * // => [0,1,2,3,4]
 *
 * // Dice roll
 * construct(() => 1 + Math.floor(Math.random()*5), 10)
 * // => [4,4,4,4,4,4,4,4,4,4]
 * // What, it's just as likely as any other sequence of 10 rolls!
 *
 * // Really ghetto clock app
 * const x = construct(() => new Date());
 * for(const d of x) console.log(d);
 * // 2020-04-07T16:57:44.675Z
 * // 2020-04-07T16:57:44.675Z
 * // 2020-04-07T16:57:44.676Z
 * // ... and so on
 * ```
 */
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
