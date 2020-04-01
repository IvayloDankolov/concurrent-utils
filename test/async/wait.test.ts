import { async, seq, t } from '../../src';
import { maxSignedInteger } from '../../src/constants';

jest.useFakeTimers();

describe('wait', () => {
  it('correctly resolves the promise when timer runs out', async () => {
    const p = async.wait(0);

    const pending = jest.fn();
    p.then(pending);

    expect(pending).not.toBeCalled();

    jest.runAllTimers();

    expect(await p).toBeUndefined();
  });

  it('sets a system timeout with the correct value', async () => {
    const timeouts = seq.construct(() => Math.random() * maxSignedInteger, 100);

    await t.forEach(timeouts, async timeout => {
      const p = async.wait(timeout);

      jest.runAllTimers();

      expect(setTimeout).toHaveBeenLastCalledWith(
        expect.any(Function),
        timeout
      );

      expect(await p).toBeUndefined();
    });
  });

  it('should reject garbage values', () => {
    const garbage = [NaN, +Infinity, -Infinity, 1e1000, -1];
    garbage.forEach(g => expect(() => async.wait(g)).toThrowError());
  });
});
