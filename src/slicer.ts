export type TSlicerState = {
  filtered: boolean,
  selected: boolean
};

export enum SlicerModifier {
  NO_KEY = 0,
  CTRL_KEY = 1,
  SHIFT_KEY = 2
}

export class Slicer<T> {
  private _: Map<T, TSlicerState> = new Map<T, TSlicerState>();
  private _selectionCount: number = 0;
  
  public get members(): any {
    const result: T[] = [];
    this._.forEach((value: TSlicerState, key: T) => {
      result.push(key);
    });    
    return result;
  }

  public get selection(): T[] {
    const result: T[] = [];
    if (this._selectionCount > 0) {
      this._.forEach((value: TSlicerState, key: T) => {
        if (value.selected) {
          result.push(key);
        }
      });
    }
    return result;
  }

  public lastSelection: T | undefined;

  constructor(list?: T[]) {
    if (list) {
      if (Array.isArray(list)) {
        list.forEach((item: T) => {
          if (!this._.has(item)) {
            this._.set(item, { filtered: false, selected: false });
          }
        });
      } else if (!this._.has(list)) {
        this._.set(list, { filtered: false, selected: false });
      }
    }
  }

  /**
   * Add item to slicer
   * @param key 
   */
  public add(key: T): Slicer<T> {
    if (!this._.has(key)) {
      let state: TSlicerState = { filtered: false, selected: false };
      if (this._selectionCount > 0) {
        state.filtered = true;
      }
      this._.set(key, state);
    }
    return this;
  }

  /**
   * Removes all selections on the slicer
   */
  public clear(): Slicer<T> {
    this._.forEach((_: TSlicerState, key: T) => {
      this._.set(key, { filtered: false, selected: false });
    });
    this._selectionCount = 0;
    this.lastSelection = undefined;
    return this;
  }

  /**
   * Returns true if key already in data set
   * @param key - item to search
   */
  public has(key: T): boolean {
    return this._.has(key);
  }

  /**
   * Returns true if item is filtered
   * @param key - item to search for
   */
  public isFiltered(key: T): boolean {
    const item: TSlicerState | undefined =  this._.get(key);
    return item ? item.filtered : false;
  }

  /**
   * Returns true if item is selected
   * @param key - item to search for
   */
  public isSelected(key: T): boolean {
    const item: TSlicerState | undefined =  this._.get(key);
    return item ? item.selected : false;
  }

  /**
   * Remove item from slicer
   * @param key - item to remove
   */
  public remove(key: T): Slicer<T> {
    const state: TSlicerState | undefined = this._.get(key);
    if (state && state.selected) {
      --this._selectionCount;
    }
    this._.delete(key);
    if (this._selectionCount === 0) {
      this.clear();
    } else if (this.lastSelection === key) {
      this.lastSelection = this.selection[0];
    }
    return this;
  }

  /**
   * Updates the slicer state
   * @param item - item selected by user
   * @param modifier - was any modifying key pressed
   */
  public toggle(item: T, modifier: SlicerModifier = SlicerModifier.NO_KEY): Slicer<T> {
    if (modifier === SlicerModifier.SHIFT_KEY) {
      return this.toggleRange(item);
    } else if (modifier === SlicerModifier.CTRL_KEY) {
      return this.toggleCumulative(item);
    } else {
      return this.toggleSingle(item);
    }
  }

  /**
   * Updates the slicer state using Ctrl key modifier
   * @param key - item selected by user
   */
  public toggleCumulative(key: T): Slicer<T> {
    const state: TSlicerState | undefined = this._.get(key);
    if (state) {
      state.selected = !state.selected;
      if (state.selected) {
        ++this._selectionCount;
      } else {
        --this._selectionCount;
      }
      this._.set(key, state);
    }
    if (this._selectionCount === 0 || this._selectionCount === this._.size) {
      this.clear();
    } else {
      this._.forEach((value: TSlicerState, key: T) => {
        value.filtered = !value.selected;
        this._.set(key, value);
      });
      this.lastSelection = key;
    }
    return this;
  }

  /**
   * Updates the slicer state using Shift key modifier
   * @param item - item selected by user
   */
  public toggleRange(item: T): Slicer<T> {
    if (item === this.lastSelection) {
      this.clear();
    } else {
      let state: number = 0;
      this._selectionCount = 0;
      this._.forEach((value: TSlicerState, key: T) => {
        if (state === 1) { // in progress
          if (item === key || this.lastSelection === key) { // signifies end of range choice
            state = -1;
          } 
          if (this.lastSelection === undefined) {
            state = -1;
            value = { filtered: true, selected: false };
          } else {
            value = { filtered: false, selected: true };
            ++this._selectionCount;
          }
        } else if (state === 0) { // pending
          if (item === key || this.lastSelection === key) {
            state = 1;
            value = { filtered: false, selected: true };
            ++this._selectionCount;
          } else {
            value = { filtered: true, selected: false };
          }
        } else { // stopped
          value = { filtered: true, selected: false };
        }
        this._.set(key, value);
      });
      this.lastSelection = item;
      if (this._selectionCount === 0 || this._selectionCount === this._.size) {
        this.clear();
      }
    }
    return this;
  }

  /**
   * Updates the slicer state without key modifier
   * @param item - item selected by user
   */
  public toggleSingle(item: T): Slicer<T> {
    const state: TSlicerState | undefined = this._.get(item);
    if (state) {
      if (state.selected) {
        this.clear();
      } else {
        this._.forEach((value: TSlicerState, key: T) => {
          if (item === key) {
            value.selected = !value.selected;
            value.filtered = !value.selected;
          } else {
            value = { filtered: true, selected: false };
          }
          this._.set(key, value);
        });
        this._selectionCount = 1;
        this.lastSelection = item;
      }
    }
    return this;
  }
}
