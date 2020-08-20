/**
 * Implements a basic queue
 */
export class Queue<T> {
  private _: T[] = [];

  public get first(): T | unknown { return this._.length > 0 ? this._[0] : null; }
  public get last(): T | unknown { return this._.length > 0 ? this._[this._.length - 1] : null; }
  public get length(): number { return this._.length; }

  constructor(list?: T[]) {
    if (Array.isArray(list)) {
      list.forEach(i => this._.push(i));
    }
  }

  public clear(): Queue<T> {
    this._ = [];
    return this;
  }

  /**
   * join item to end of queue
   * @param item
   */
  public join(item: T): Queue<T> { this._.push(item); return this; }

  /**
   * join item at front of queue
   * @param item
   */
  public jump(item: T): Queue<T> { this._.unshift(item); return this; }

  /**
   * remove item from end of queue
   */
  public leave = () => this._.length > 0 ? this._.pop() : null;

  /**
   * remove item from front of queue
   */
  public next = () => this._.length > 0 ? this._.shift() : null;

  public toArray = () => this._;
}
