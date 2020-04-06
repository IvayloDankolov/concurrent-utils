import { seq } from '../../src';

describe('numeric', () => {
  it('works for ascending sequences, respecting all 3 parameters', () => {
    const startMin = 0,
      startMax = 10;
    const stepMin = 1,
      stepMax = 10;
    const itemsMin = 1,
      itemsMax = 10;
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
    const startGarbage = [NaN, +Infinity, -Infinity];
    const stopGarbage = [NaN, +Infinity, -Infinity];
    const stepGarbage = [NaN, +Infinity, -Infinity, 0];

    startGarbage.forEach(from =>
      expect(() => seq.numeric({ from })).toThrowError()
    );
    stopGarbage.forEach(to => expect(() => seq.numeric({ to })).toThrowError());
    stepGarbage.forEach(step =>
      expect(() => seq.numeric({ step })).toThrowError()
    );
  });

  it('works for infinite sequences without taking infinite time', () => {
    // Testing this to the limit is left as an exercise for the creators of the Simulation.
    const cutoff = 1000;

    const gen = seq.numeric({ from: 5, step: 10 });
    for (let i = 0; i < cutoff; ++i) {
      const { value, done } = gen.next();
      expect(value).toBe(5 + 10 * i);
      expect(done).toBe(false);
    }

    const genNeg = seq.numeric({ from: 42, step: -17 });
    for (let i = 0; i < cutoff; ++i) {
      const { value, done } = genNeg.next();
      expect(value).toBe(42 - 17 * i);
      expect(done).toBe(false);
    }
  });
});
