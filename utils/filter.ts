interface FilterIteratee<T> {
  (curr: T, index?: number): boolean;
}

export default <T>(collection: T[], iteratee: FilterIteratee<T>): T[] => {
  let filted: T[] = [];
  let index = -1;
  let length = collection.length;

  while (++index < length) {
    if (iteratee(collection[index], index)) {
      filted.push(collection[index]);
    }
  }

  return filted;
};
