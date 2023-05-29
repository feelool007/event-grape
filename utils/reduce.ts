interface ReduceIteratee<T, C> {
  (accumulator: T, current: C, index?: number): T;
}

export default <T, TResult>(
  collection: T[],
  iteratee: ReduceIteratee<TResult, T>,
  initAcc: TResult
): TResult => {
  let index = -1;
  let length = collection.length;
  let accumulator = initAcc;

  while (++index < length) {
    accumulator = iteratee(accumulator, collection[index], index);
  }

  return accumulator;
};
