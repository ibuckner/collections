import { Queue, Slicer, SlicerModifier, uniqueArray } from ".";

test("Test array functions", () => {
  const strings: string[] = ["grape", "apple", "pear", "pear"];
  expect(uniqueArray(strings)).toStrictEqual(["grape", "apple", "pear"]);
});

test("Queue tests", () => {
  const q1: Queue<any> = new Queue();
  const q2: Queue<number> = new Queue([1,2,3,4,5]);
  expect(q1.length).toStrictEqual(0);
  expect(q2.length).toStrictEqual(5);
  expect(q1.first).toBeNull();
  expect(q2.first).toStrictEqual(1);
  expect(q1.last).toBeNull();
  expect(q2.last).toStrictEqual(5);
  q2.clear();
  expect(q2.length).toStrictEqual(0);
  q2.join(1).join(2).join(3).jump(11).join(33);
  expect(q2.length).toStrictEqual(5);
  expect(q2.first).toStrictEqual(11);
  expect(q2.last).toStrictEqual(33);
  const a: number | null | undefined = q2.leave();
  const b: number | null | undefined = q2.next();
  expect(a).toStrictEqual(33);
  expect(b).toStrictEqual(11);
  expect(q2.toArray()).toStrictEqual([1,2,3]);
});

test("Test slicer using Ctrl key", () => {
  const slicer: Slicer<string> = new Slicer<string>(["cat", "dog", "rat"]);
  expect(slicer.lastSelection).toBeUndefined();
  expect(slicer.selection).toStrictEqual([]);
  expect(slicer.members).toStrictEqual(["cat", "dog", "rat"]);

  slicer.toggle("rat", SlicerModifier.CTRL_KEY);
  slicer.add("flea");
  expect(slicer.has("flea")).toBe(true);
  expect(slicer.has("mouse")).toBe(false);
  expect(slicer.members).toStrictEqual(["cat", "dog", "rat", "flea"]);
  expect(slicer.lastSelection).toBe("rat");
  expect(slicer.selection).toStrictEqual(["rat"]);
  expect(slicer.isSelected("rat")).toBe(true);
  expect(slicer.isFiltered("flea")).toBe(true);
  expect(slicer.isFiltered("rat")).toBe(false);

  slicer.toggle("cat", SlicerModifier.CTRL_KEY);
  expect(slicer.members).toStrictEqual(["cat", "dog", "rat", "flea"]);
  expect(slicer.lastSelection).toBe("cat");
  expect(slicer.selection).toStrictEqual(["cat", "rat"]);

  slicer.toggle("rat", SlicerModifier.CTRL_KEY);
  slicer.remove("flea");
  expect(slicer.members).toStrictEqual(["cat", "dog", "rat"]);
  expect(slicer.lastSelection).toBe("rat");
  expect(slicer.selection).toStrictEqual(["cat"]);

  slicer.toggle("cat", SlicerModifier.CTRL_KEY);
  expect(slicer.members).toStrictEqual(["cat", "dog", "rat"]);
  expect(slicer.lastSelection).toBeUndefined();
  expect(slicer.selection).toStrictEqual([]);
});

test("Test slicer with no key", () => {
  const slicer: Slicer<string> = new Slicer<string>(["cat", "dog", "rat"]);
  expect(slicer.lastSelection).toBeUndefined();
  expect(slicer.selection).toStrictEqual([]);
  expect(slicer.members).toStrictEqual(["cat", "dog", "rat"]);

  slicer.toggle("rat");
  slicer.add("flea");
  expect(slicer.members).toStrictEqual(["cat", "dog", "rat", "flea"]);
  expect(slicer.selection).toStrictEqual(["rat"]);
  expect(slicer.lastSelection).toBe("rat");

  slicer.toggle("cat");
  slicer.remove("flea");
  expect(slicer.members).toStrictEqual(["cat", "dog", "rat"]);
  expect(slicer.lastSelection).toBe("cat");
  expect(slicer.selection).toStrictEqual(["cat"]);

  slicer.toggle("cat");
  expect(slicer.members).toStrictEqual(["cat", "dog", "rat"]);
  expect(slicer.lastSelection).toBeUndefined();
  expect(slicer.selection).toStrictEqual([]);
});

test("Test slicer using Shift key", () => {
  const slicer: Slicer<string> = new Slicer<string>(["cat", "dog", "rat"]);
  expect(slicer.lastSelection).toBeUndefined();
  expect(slicer.selection).toStrictEqual([]);
  expect(slicer.members).toStrictEqual(["cat", "dog", "rat"]);

  slicer.toggle("cat");
  expect(slicer.members).toStrictEqual(["cat", "dog", "rat"]);
  expect(slicer.lastSelection).toBe("cat");
  expect(slicer.selection).toStrictEqual(["cat"]);

  slicer.toggle("rat", SlicerModifier.SHIFT_KEY);
  slicer.add("flea");
  expect(slicer.members).toStrictEqual(["cat", "dog", "rat", "flea"]);
  expect(slicer.lastSelection).toBeUndefined();
  expect(slicer.selection).toStrictEqual([]);

  slicer.toggle("rat", SlicerModifier.SHIFT_KEY);
  expect(slicer.lastSelection).toBe("rat");
  expect(slicer.members).toStrictEqual(["cat", "dog", "rat", "flea"]);
  expect(slicer.selection).toStrictEqual(["rat"]);

  slicer.toggle("flea", SlicerModifier.SHIFT_KEY);
  slicer.remove("flea");
  expect(slicer.lastSelection).toBe("rat");
  expect(slicer.members).toStrictEqual(["cat", "dog", "rat"]);
  expect(slicer.selection).toStrictEqual(["rat"]);

  slicer.toggle("dog", SlicerModifier.SHIFT_KEY);
  expect(slicer.lastSelection).toBe("dog");
  expect(slicer.members).toStrictEqual(["cat", "dog", "rat"]);
  expect(slicer.selection).toStrictEqual(["dog", "rat"]);

  slicer.toggle("dog", SlicerModifier.SHIFT_KEY);
  expect(slicer.lastSelection).toBeUndefined();
  expect(slicer.members).toStrictEqual(["cat", "dog", "rat"]);
  expect(slicer.selection).toStrictEqual([]);
});