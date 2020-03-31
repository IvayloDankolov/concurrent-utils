import invariant from 'tiny-invariant';

/**
 * Returns a promise that automatically resolves after a specified time.
 * 
 * @param timeout Time to wait before resolving promise (in milliseconds)
 */
export const wait = (timeout: number): Promise<void> => {
    invariant(timeout >= 0, "Wait time cannot be negative");
    return new Promise(resolve => setTimeout(resolve, timeout));
};
