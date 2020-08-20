import { uniqueArray } from ".";

test("Test array functions", () => {
  const strings: string[] = ["grape", "apple", "pear", "pear"];
  expect(uniqueArray(strings)).toStrictEqual(["grape", "apple", "pear"]);
});
