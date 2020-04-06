import { t, seq } from '../../src';

describe('forEach', () => {
  it('works for basic arrays', () => {
    const itemCount = 100;
    const data: object[] = Array.from(seq.construct(() => ({}), itemCount));

    const handler = jest.fn<void, [object]>();

    t.forEach(data, handler);

    expect(handler).toHaveBeenCalledTimes(itemCount);

    let call = 1;
    for (const item of data) {
      expect(handler).toHaveBeenNthCalledWith(call++, item);
    }
  });

  it('works for generator functions', () => {
    const itemCount = 100;
    const sequenceA = seq.numeric({ from: 1, to: itemCount });
    const sequenceB = seq.numeric({ from: 1, to: itemCount });

    const aIterated: number[] = [];
    for (const item of sequenceA) {
      aIterated.push(item);
    }

    const bIterated: number[] = [];
    t.forEach(sequenceB, item => {
      bIterated.push(item);
    });

    expect(aIterated).toEqual(bIterated);
  });

  it('works for async generators', async () => {
    const itemCount = 100;

    const asyncGen = async function* (count: number) {
      for (let i = 0; i < count; ++i) {
        yield await Promise.resolve(i);
      }
    };

    const sequenceA = asyncGen(itemCount);
    const sequenceB = asyncGen(itemCount);

    const aIterated: number[] = [];
    for await (const item of sequenceA) {
      aIterated.push(item);
    }

    const bIterated: number[] = [];
    await t.forEach(sequenceB, item => {
      bIterated.push(item);
    });

    expect(aIterated).toEqual(bIterated);
  });

  it("doesn't call handler on empty sequences", async () => {
    const handler = jest.fn();

    t.forEach([], handler);
    t.forEach((function* () {})(), handler);
    await t.forEach((async function* () {})(), handler);

    expect(handler).not.toBeCalled();
  });

  it('works for basic arrays with asynchronous handlers', async () => {
    const itemCount = 100;
    const arr: object[] = Array.from(seq.construct(() => ({}), itemCount));

    const handler = jest.fn((_: object) => Promise.resolve(undefined));

    const promise = t.forEach(arr, handler);

    expect(handler).toBeCalledTimes(1); // Awaiting first promise

    await promise;

    expect(handler).toBeCalledTimes(itemCount);

    arr.forEach((item, idx) => {
      expect(handler).toHaveBeenNthCalledWith(idx + 1, item);
    });
  });

  it('works for generator functions when using asynchronous handlers', async () => {
    const itemCount = 100;
    const sequenceA = seq.numeric({ from: 1, to: itemCount });
    const sequenceB = seq.numeric({ from: 1, to: itemCount });

    const aIterated: number[] = [];
    for (const item of sequenceA) {
      aIterated.push(item);
    }

    const bIterated: number[] = [];

    const handler = jest.fn(item => {
      bIterated.push(item);
      return Promise.resolve(undefined);
    });

    const p = t.forEach(sequenceB, handler);

    expect(handler).toBeCalledTimes(1);

    await p;

    expect(handler).toBeCalledTimes(itemCount);

    expect(aIterated).toEqual(bIterated);
  });

  it('works for asynchronous generators when using asynchronous handlers', async () => {
    const itemCount = 100;

    const asyncGen = async function* (count: number) {
      for (let i = 0; i < count; ++i) {
        yield await Promise.resolve(i);
      }
    };

    const sequenceA = asyncGen(itemCount);
    const sequenceB = asyncGen(itemCount);

    const aIterated: number[] = [];
    for await (const item of sequenceA) {
      aIterated.push(item);
    }

    const bIterated: number[] = [];
    const handler = jest.fn(item => {
      bIterated.push(item);
      return Promise.resolve(undefined);
    });

    const p = t.forEach(sequenceB, handler);

    // Different from other tests in that it's still awaiting the sequence item
    expect(handler).not.toBeCalled();

    await p;

    expect(handler).toBeCalledTimes(itemCount);

    expect(aIterated).toEqual(bIterated);
  });
});
