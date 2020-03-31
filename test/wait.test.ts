import { async } from '../src';

jest.useFakeTimers();

describe('wait', () => {
  it('correctly resolves the promise when timer runs out', async () => {

    const p = async.wait(0);

    const pending = jest.fn();
    p.then(pending);

    expect(pending).not.toBeCalled();

    jest.runAllTimers();

    const x = await p;
    expect(x).toBeUndefined();
  });
});
