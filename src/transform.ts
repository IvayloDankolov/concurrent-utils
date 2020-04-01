export async function forEach<T>(
  iterable: Iterable<T> | AsyncIterable<T>,
  handler: (item: T) => void | Promise<void>
) {
  for await (let item of iterable) {
    const p = handler(item);
    if (p instanceof Promise) {
      await p;
    }
  }
}
