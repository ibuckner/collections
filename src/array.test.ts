import { uniqueArray } from ".";

test("Test array functions", () => {
  const strings: string[] = ["grape", "apple", "pear", "pear"];
  const oddList: any = {};
  expect(uniqueArray(strings)).toStrictEqual(["grape", "apple", "pear"]);
  expect(uniqueArray(oddList)).toStrictEqual({});
});
