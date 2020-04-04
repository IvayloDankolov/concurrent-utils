import invariant from 'tiny-invariant';

export function forEach<T>(
  iterable: AsyncIterable<T>,
  handler: (item: T) => Promise<void> | null | undefined
): Promise<void>;
export function forEach<T>(
  iterable: AsyncIterable<T>,
  handler: (item: T) => void
): Promise<void>;
export function forEach<T>(
  iterable: Iterable<T>,
  handler: (item: T) => void
): Promise<void>;
export function forEach<T>(
  iterable: Iterable<T>,
  handler: (item: T) => Promise<void> | null | undefined
): Promise<void>;
export function forEach<T>(
  iterable: Iterable<T>,
  handler: (item: T) => void
): void;
export function forEach(iterable: any, handler: any) {
  if (iterable[Symbol.iterator] != null) {
    const iterator: Iterator<any> = iterable[Symbol.iterator]();
    let foundPromise: Promise<any>;
    while (true) {
      const next = iterator.next();
      if (next.done) {
        return;
      }

      const handled = handler(next.value);
      if (handled instanceof Promise) {
        foundPromise = next.value;
        break;
      }
    }
    // Found a promise, need to fall back to async iteration
    return (async () => {
      await foundPromise;
      while (true) {
        const next = iterator.next();
        if (next.done) {
          return;
        }

        const handled = handler(next.value);
        if (handled instanceof Promise) {
          await handled;
        }
      }
    })();
  } else if (iterable[Symbol.asyncIterator] != null) {
    return (async () => {
      for await (const item of iterable) {
        const p = handler(item);
        if (p instanceof Promise) {
          await p;
        }
      }
    })();
  } else {
    invariant(
      false,
      "forEach called with object that's not an Iterable or AsyncIterable"
    );
  }
}
