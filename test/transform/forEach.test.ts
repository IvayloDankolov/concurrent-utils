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
    const sequenceA = seq.numeric(0, 1, 100);
    const sequenceB = seq.numeric(0, 1, 100);

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
    const asyncGen = async function* (count: number) {
      for (let i = 0; i < count; ++i) {
        yield await Promise.resolve(i);
      }
    };

    const sequenceA = asyncGen(100);
    const sequenceB = asyncGen(100);

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
});
