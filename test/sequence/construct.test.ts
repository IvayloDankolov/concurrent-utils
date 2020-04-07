import { seq } from '../../src';

describe('sequence.construct', () => {
  it('should work in the finite case', () => {
    const limit = 100;
    const ctor = jest.fn(() => ({}));

    const iterator = seq.construct(ctor, limit);

    expect(ctor).not.toBeCalled();

    for (let i = 0; i < limit; ++i) {
      const next = iterator.next();
      expect(ctor).toHaveBeenCalledTimes(i + 1);
      expect(ctor).toHaveBeenLastCalledWith(i);

      expect(next.value).toBe(ctor.mock.results[i].value);
      expect(next.done).toBe(false);
    }

    expect(iterator.next().done).toBe(true);
    expect(ctor).toBeCalledTimes(limit);
  });

  it('should work in the infinite case', () => {
    const testLimit = 100;
    const ctor = jest.fn(() => ({}));

    const iterator = seq.construct(ctor);

    expect(ctor).not.toBeCalled();

    for (let i = 0; i < testLimit; ++i) {
      const next = iterator.next();
      expect(ctor).toHaveBeenCalledTimes(i + 1);
      expect(ctor).toHaveBeenLastCalledWith(i);

      expect(next.value).toBe(ctor.mock.results[i].value);
      expect(next.done).toBe(false);
    }

    expect(iterator.next().done).toBe(false);
    expect(ctor).toBeCalledTimes(testLimit + 1);
  });

  it('should return an empty sequence when given a count of zero', () => {
    const ctor = jest.fn(() => ({}));
    const iterator = seq.construct(ctor, 0);

    expect(iterator.next().done).toBe(true);
    expect(ctor).not.toBeCalled();
  });

  it('should reject negative counts', () => {
    const ctor = jest.fn(() => ({}));

    expect(() => seq.construct(ctor, -100)).toThrow(/negative/i);
    expect(() => seq.construct(ctor, -1)).toThrow(/negative/i);
    expect(() => seq.construct(ctor, -Number.MAX_SAFE_INTEGER)).toThrow(
      /negative/i
    );

    expect(ctor).not.toBeCalled();
  });

  it('should reject fractional counts', () => {
    const ctor = jest.fn(() => ({}));

    expect(() => seq.construct(ctor, 0.5)).toThrow(/integer/i);
    expect(() => seq.construct(ctor, 1e-300)).toThrow(/integer/i);
    expect(() => seq.construct(ctor, 1e19 + 1e-1)).toThrow(/integer/i);

    expect(ctor).not.toBeCalled();
  });

  it('should reject counts that cause floating point gap issues', () => {
    const ctor = jest.fn(() => ({}));

    expect(() => seq.construct(ctor, Number.MAX_SAFE_INTEGER)).not.toThrow();
    expect(() => seq.construct(ctor, Number.MAX_SAFE_INTEGER + 1)).toThrow(
      /integer/i
    );
    expect(() => seq.construct(ctor, 1e100)).toThrow(/integer/i);

    expect(ctor).not.toBeCalled();
  });
});
