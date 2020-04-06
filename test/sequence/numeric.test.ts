import { seq } from '../../src';

describe('numeric', () => {
  // it('works for ascending sequences, respecting all 3 parameters', () => {
  //   const startMin = 0,
  //     startMax = 10;
  //   const stepMin = 1,
  //     stepMax = 10;
  //   const itemsMin = 1,
  //     itemsMax = 10;
  //   for (let start = startMin; start <= startMax; ++start) {
  //     for (let step = stepMin; step <= stepMax; ++step) {
  //       for (let items = itemsMin; items < itemsMax; ++items) {
  //         const stop = start + (items - 1) * step;
  //         const iterator = seq.numeric({ from: start, to: stop, step });
  //         for (let i = start; i <= stop; i += step) {
  //           const next = iterator.next();
  //           expect(next.value).toEqual(i);
  //           expect(next.done).toEqual(false);
  //         }
  //         expect(iterator.next().done).toEqual(true);
  //       }
  //     }
  //   }
  // });

  // it('works for descending sequences, respecting all 3 parameters', () => {
  //   const startMin = 0,
  //     startMax = 10;
  //   const stepMin = 1,
  //     stepMax = 10;
  //   const itemsMin = 1,
  //     itemsMax = 10;
  //   for (let start = startMin; start <= startMax; ++start) {
  //     for (let step = stepMin; step <= stepMax; ++step) {
  //       for (let items = itemsMin; items < itemsMax; ++items) {
  //         const stop = start - (items - 1) * step;
  //         const iterator = seq.numeric({ from: start, to: stop, step: -step });
  //         for (let i = start; i >= stop; i -= step) {
  //           const next = iterator.next();
  //           expect(next.value).toEqual(i);
  //           expect(next.done).toEqual(false);
  //         }
  //         expect(iterator.next().done).toEqual(true);
  //       }
  //     }
  //   }
  // });

  it('rejects garbage parameter values', () => {
    // const startGarbage = [NaN, +Infinity, -Infinity];
    const stopGarbage = [NaN, +Infinity, -Infinity];
    const stepGarbage = [NaN, +Infinity, -Infinity, 0];

    stopGarbage.forEach(from =>
      expect(() => seq.numeric({ from })).toThrowError()
    );
    stopGarbage.forEach(to => expect(() => seq.numeric({ to })).toThrowError());
    stepGarbage.forEach(step =>
      expect(() => seq.numeric({ step })).toThrowError()
    );
  });
});
