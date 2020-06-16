/**
 * Implements a basic queue
 */
export declare class Queue<T> {
    private _;
    get first(): T | unknown;
    get last(): T | unknown;
    get length(): number;
    constructor(list?: T[]);
    clear(): Queue<T>;
    /**
     * join item to end of queue
     * @param item
     */
    join(item: T): Queue<T>;
    /**
     * join item at front of queue
     * @param item
     */
    jump(item: T): Queue<T>;
    /**
     * remove item from end of queue
     */
    leave: () => T | null | undefined;
    /**
     * remove item from front of queue
     */
    next: () => T | null | undefined;
    toArray: () => T[];
}
export declare type TSlicerState = {
    filtered: boolean;
    selected: boolean;
};
export declare enum SlicerModifier {
    NO_KEY = 0,
    CTRL_KEY = 1,
    SHIFT_KEY = 2
}
export declare class Slicer<T> {
    private _;
    private _selectionCount;
    get members(): any;
    get selection(): T[];
    lastSelection: T | undefined;
    constructor(list?: T[]);
    /**
     * Add item to slicer
     * @param key
     */
    add(key: T): Slicer<T>;
    /**
     * Removes all selections on the slicer
     */
    clear(): Slicer<T>;
    /**
     * Returns true if key already in data set
     * @param key - item to search
     */
    has(key: T): boolean;
    /**
     * Returns true if item is filtered
     * @param key - item to search for
     */
    isFiltered(key: T): boolean;
    /**
     * Returns true if item is selected
     * @param key - item to search for
     */
    isSelected(key: T): boolean;
    /**
     * Remove item from slicer
     * @param key - item to remove
     */
    remove(key: T): Slicer<T>;
    /**
     * Updates the slicer state
     * @param item - item selected by user
     * @param modifier - was any modifying key pressed
     */
    toggle(item: T, modifier?: SlicerModifier): Slicer<T>;
    /**
     * Updates the slicer state using Ctrl key modifier
     * @param key - item selected by user
     */
    toggleCumulative(key: T): Slicer<T>;
    /**
     * Updates the slicer state using Shift key modifier
     * @param item - item selected by user
     */
    toggleRange(item: T): Slicer<T>;
    /**
     * Updates the slicer state without key modifier
     * @param item - item selected by user
     */
    toggleSingle(item: T): Slicer<T>;
}
/**
 * returns a set (unique) of values from an array
 * @param a - array of values
 */
export declare function uniqueArray<T>(a: T[]): T[];
