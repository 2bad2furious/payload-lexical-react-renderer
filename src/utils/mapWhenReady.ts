import {Asyncable, Awaitable, AwaitedAsyncable} from "../types";

type AsyncableReturnType<Async extends boolean, R> = Async extends true ? Awaitable<R> : R;

export function mapWhenReady<Async extends boolean, T extends Awaited<unknown>, R extends Awaited<unknown>>(
    v: Asyncable<Async, T>,
    cb: (v: AwaitedAsyncable<T>) => AsyncableReturnType<Async, R>
): Asyncable<Async, R> {
    // Assume the value could be promise
    const asyncableValue = v as Asyncable<true, T>;

    if (!asyncableValue || typeof asyncableValue !== "object" || !(asyncableValue instanceof Promise)) {
        return cb(asyncableValue as AwaitedAsyncable<T>);
    }

    return asyncableValue.then(a => cb(a as AwaitedAsyncable<T>)) as Asyncable<Async, R>
}