import { seq } from '../../src';

describe('numeric', () => {
  it('works for ascending sequences, respecting all 3 parameters', () => {
    const startMin = 0,
      startMax = 10;
    const stepMin = 1,
      stepMax = 10;
    const itemsMin = 1,
      itemsMax = 10;

    // Holy O(n^4), Batman!

    for (let start = startMin; start <= startMax; ++start) {
      for (let step = stepMin; step <= stepMax; ++step) {
        for (let items = itemsMin; items < itemsMax; ++items) {
          const stop = start + (items - 1) * step;
          const iterator = seq.numeric({ from: start, to: stop, step });
          for (let i = start; i <= stop; i += step) {
            const next = iterator.next();
            expect(next.value).toBe(i);
            expect(next.done).toBe(false);
          }
          expect(iterator.next().done).toBe(true);
        }
      }
    }
  });

  it('works for descending sequences, respecting all 3 parameters', () => {
    const startMin = 0,
      startMax = 10;
    const stepMin = 1,
      stepMax = 10;
    const itemsMin = 1,
      itemsMax = 10;
    for (let start = startMin; start <= startMax; ++start) {
      for (let step = stepMin; step <= stepMax; ++step) {
        for (let items = itemsMin; items < itemsMax; ++items) {
          const stop = start - (items - 1) * step;
          const iterator = seq.numeric({ from: start, to: stop, step: -step });
          for (let i = start; i >= stop; i -= step) {
            const next = iterator.next();
            expect(next.value).toBe(i);
            expect(next.done).toBe(false);
          }
          expect(iterator.next().done).toBe(true);
        }
      }
    }
  });

  it('rejects garbage parameter values', () => {
    const garbage = [NaN, +Infinity, -Infinity];
    garbage.forEach(item => {
      expect(() => seq.numeric({ from: item })).toThrowError();
      expect(() => seq.numeric({ to: item })).toThrowError();
      expect(() => seq.numeric({ step: item })).toThrowError();
    });
  });

  it('rejects a step of zero', () => {
    expect(() => seq.numeric({ step: 0 })).toThrow();
  });

  it('rejects a step too small to clear the floating point gap', () => {
    expect(() =>
      seq.numeric({ from: Number.MAX_SAFE_INTEGER, step: 1 })
    ).not.toThrow();
    expect(() =>
      seq.numeric({ from: Number.MAX_SAFE_INTEGER + 1, step: 1 })
    ).toThrow();

    expect(() =>
      seq.numeric({ from: -Number.MAX_SAFE_INTEGER, step: -1 })
    ).not.toThrow();
    expect(() =>
      seq.numeric({ from: -Number.MAX_SAFE_INTEGER - 1, step: -1 })
    ).toThrow();

    expect(() => seq.numeric({ to: 1e100, step: 1 })).toThrow();
    expect(() => seq.numeric({ to: 1e100, step: 1e84 })).not.toThrow();
    expect(() => seq.numeric({ to: -1e100, step: -1 })).toThrow();
    expect(() => seq.numeric({ to: -1e100, step: -1e84 })).not.toThrow();
  });

  it('works for infinite sequences without taking infinite time', () => {
    // Testing this to the limit is left as an exercise for the creators of the Simulation.
    const cutoff = 1000;

    let start = 5,
      step = 10;
    const gen = seq.numeric({ from: start, step });
    for (let i = 0; i < cutoff; ++i) {
      const { value, done } = gen.next();
      expect(value).toBe(start + step * i);
      expect(done).toBe(false);
    }

    start = 42;
    step = -17;
    const genNeg = seq.numeric({ from: start, step });
    for (let i = 0; i < cutoff; ++i) {
      const { value, done } = genNeg.next();
      expect(value).toBe(start + step * i);
      expect(done).toBe(false);
    }
  });

  it('produces empty sequences when end < start (or end > start for decreasing ones)', () => {
    expect(Array.from(seq.numeric({ from: 100, to: 99.99 }))).toEqual([]);
    expect(Array.from(seq.numeric({ from: -1, to: 0, step: -1 }))).toEqual([]);
  });
});
