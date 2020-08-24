import { Slicer, SlicerModifier } from ".";

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

  slicer.remove("rat").remove("dog").remove("cat");
  expect(slicer.lastSelection).toBeUndefined();
});

test("Test slicer with no key", () => {
  const slicer: Slicer<string> = new Slicer<string>();
  slicer.add("cat").add("dog").add("rat");
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
  const slicer: Slicer<string> = new Slicer<string>("cat");
  slicer.add("dog").add("rat");
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
