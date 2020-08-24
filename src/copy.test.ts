import { deepCopy } from ".";

test("Test deepCopy function", () => {
  const a: any = { letter: "a", seq: [1, 2, 3] };
  const b: any = deepCopy(a);
  b.letter = "b";
  b.seq = [4, 5, 6];
  expect(b.letter === "b" && a.letter === "a" && a.seq !== b.seq).toBe(true);
});
