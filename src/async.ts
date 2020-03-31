import invariant from 'tiny-invariant';
import { maxSignedInteger } from './constants';

/**
 * Returns a promise that automatically resolves after a specified time.
 *
 * @param timeout Time to wait before resolving promise (in milliseconds)
 */
export const wait = (timeout: number): Promise<void> => {
  invariant(timeout >= 0, 'Wait time cannot be negative');
  invariant(isFinite(timeout), 'Wait time cannot be infinite or NaN');
  invariant(
    timeout <= maxSignedInteger,
    `Wait time ${timeout} does not fit into a signed 32-bit integer`
  );
  return new Promise(resolve => setTimeout(resolve, timeout));
};
