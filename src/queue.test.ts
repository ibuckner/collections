import { Queue } from ".";

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
