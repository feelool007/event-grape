import filter from "../filter";

interface DummyData {
  name: string;
  age: number;
  gender: "male" | "female" | "neutral";
}

let dummyData: DummyData[] = [
  {
    name: "Sandy",
    age: 30,
    gender: "female",
  },
  {
    name: "Kyle",
    age: 34,
    gender: "male",
  },
  {
    name: "Rachel",
    age: 27,
    gender: "female",
  },
  {
    name: "Michael",
    age: 24,
    gender: "neutral",
  },
];

test("Should return female.", () => {
  let expectedResult: DummyData[] = [
    {
      name: "Sandy",
      age: 30,
      gender: "female",
    },
    {
      name: "Rachel",
      age: 27,
      gender: "female",
    },
  ];
  let result = filter(dummyData, (d) => d.gender === "female");
  expect(result).toEqual(expectedResult);
});

test("Should return whose age is under 30.", () => {
  let expectedResult: DummyData[] = [
    {
      name: "Rachel",
      age: 27,
      gender: "female",
    },
    {
      name: "Michael",
      age: 24,
      gender: "neutral",
    },
  ];
  let result = filter(dummyData, (d) => d.age < 30);
  expect(result).toEqual(expectedResult);
});

test("Should return the even rows.", () => {
  let expectedResult: DummyData[] = [
    {
      name: "Sandy",
      age: 30,
      gender: "female",
    },
    {
      name: "Rachel",
      age: 27,
      gender: "female",
    },
  ];
  let result = filter(dummyData, (d, index) => index % 2 === 0);
  expect(result).toEqual(expectedResult);
});

test("Should return an empty array.", () => {
  let expectedResult = [];
  let result = filter(dummyData, () => false);
  expect(result).toEqual(expectedResult);
});
