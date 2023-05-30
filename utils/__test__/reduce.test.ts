import reduce from "../reduce";

interface DummyData {
  id: number;
  balance: number;
}

let dummyData: DummyData[] = [
  {
    id: 1,
    balance: 300,
  },
  {
    id: 2,
    balance: 450,
  },
  {
    id: 3,
    balance: 1020,
  },
];

test("Should return the total balance.", () => {
  let expectedResult = 300 + 450 + 1020;
  let result = reduce<DummyData, number>(
    dummyData,
    (acc, curr) => acc + curr.balance,
    0
  );
  expect(result).toBe(expectedResult);
});

test("Should return the sum of balance which is lower than 1000.", () => {
  let expectedResult = 300 + 450;
  let result = reduce<DummyData, number>(
    dummyData,
    (acc, curr) => {
      if (curr.balance < 1000) return acc + curr.balance;
      else return acc;
    },
    0
  );
  expect(result).toBe(expectedResult);
});

test("Should return the sum of balance which is even row.", () => {
  let expectedResult = 300 + 1020;
  let result = reduce<DummyData, number>(
    dummyData,
    (acc, curr, index) => {
      if (index % 2 === 0) return acc + curr.balance;
      else return acc;
    },
    0
  );
  expect(result).toBe(expectedResult);
});

test("Should return zero.", () => {
  let result = reduce<DummyData, number>(dummyData, (acc) => acc + 0, 0);
  expect(result).toBe(0);
});
