var collections = (function (exports) {
  'use strict';

  /**
   * https://2ality.com/2019/10/shared-mutable-state.html
   * @param original
   */
  function deepCopy(original) {
      if (Array.isArray(original)) {
          const copy = [];
          for (const [index, value] of original.entries()) {
              copy[index] = deepCopy(value);
          }
          return copy;
      }
      else if (typeof original === "object" && original !== null) {
          const copy = {};
          for (const [key, value] of Object.entries(original)) {
              copy[key] = deepCopy(value);
          }
          return copy;
      }
      else {
          return original;
      }
  }

  /**
   * Implements a basic queue
   */
  class Queue {
      constructor(list) {
          this._ = [];
          /**
           * remove item from end of queue
           */
          this.leave = () => this._.length > 0 ? this._.pop() : null;
          /**
           * remove item from front of queue
           */
          this.next = () => this._.length > 0 ? this._.shift() : null;
          this.toArray = () => this._;
          if (Array.isArray(list)) {
              list.forEach(i => this._.push(i));
          }
      }
      get first() { return this._.length > 0 ? this._[0] : null; }
      get last() { return this._.length > 0 ? this._[this._.length - 1] : null; }
      get length() { return this._.length; }
      clear() {
          this._ = [];
          return this;
      }
      /**
       * join item to end of queue
       * @param item
       */
      join(item) { this._.push(item); return this; }
      /**
       * join item at front of queue
       * @param item
       */
      jump(item) { this._.unshift(item); return this; }
  }

  (function (SlicerModifier) {
      SlicerModifier[SlicerModifier["NO_KEY"] = 0] = "NO_KEY";
      SlicerModifier[SlicerModifier["CTRL_KEY"] = 1] = "CTRL_KEY";
      SlicerModifier[SlicerModifier["SHIFT_KEY"] = 2] = "SHIFT_KEY";
  })(exports.SlicerModifier || (exports.SlicerModifier = {}));
  class Slicer {
      constructor(list) {
          this._ = new Map();
          this._selectionCount = 0;
          if (list) {
              if (Array.isArray(list)) {
                  list.forEach((item) => {
                      if (!this._.has(item)) {
                          this._.set(item, { filtered: false, selected: false });
                      }
                  });
              }
              else if (!this._.has(list)) {
                  this._.set(list, { filtered: false, selected: false });
              }
          }
      }
      get members() {
          const result = [];
          this._.forEach((value, key) => {
              result.push(key);
          });
          return result;
      }
      get selection() {
          const result = [];
          if (this._selectionCount > 0) {
              this._.forEach((value, key) => {
                  if (value.selected) {
                      result.push(key);
                  }
              });
          }
          return result;
      }
      /**
       * Add item to slicer
       * @param key
       */
      add(key) {
          if (!this._.has(key)) {
              let state = { filtered: false, selected: false };
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
      clear() {
          this._.forEach((_, key) => {
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
      has(key) {
          return this._.has(key);
      }
      /**
       * Returns true if item is filtered
       * @param key - item to search for
       */
      isFiltered(key) {
          const item = this._.get(key);
          return item ? item.filtered : false;
      }
      /**
       * Returns true if item is selected
       * @param key - item to search for
       */
      isSelected(key) {
          const item = this._.get(key);
          return item ? item.selected : false;
      }
      /**
       * Remove item from slicer
       * @param key - item to remove
       */
      remove(key) {
          const state = this._.get(key);
          if (state && state.selected) {
              --this._selectionCount;
          }
          this._.delete(key);
          if (this._selectionCount === 0) {
              this.clear();
          }
          else if (this.lastSelection === key) {
              this.lastSelection = this.selection[0];
          }
          return this;
      }
      /**
       * Updates the slicer state
       * @param item - item selected by user
       * @param modifier - was any modifying key pressed
       */
      toggle(item, modifier = exports.SlicerModifier.NO_KEY) {
          if (modifier === exports.SlicerModifier.SHIFT_KEY) {
              return this.toggleRange(item);
          }
          else if (modifier === exports.SlicerModifier.CTRL_KEY) {
              return this.toggleCumulative(item);
          }
          else {
              return this.toggleSingle(item);
          }
      }
      /**
       * Updates the slicer state using Ctrl key modifier
       * @param key - item selected by user
       */
      toggleCumulative(key) {
          const state = this._.get(key);
          if (state) {
              state.selected = !state.selected;
              if (state.selected) {
                  ++this._selectionCount;
              }
              else {
                  --this._selectionCount;
              }
              this._.set(key, state);
          }
          if (this._selectionCount === 0 || this._selectionCount === this._.size) {
              this.clear();
          }
          else {
              this._.forEach((value, key) => {
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
      toggleRange(item) {
          if (item === this.lastSelection) {
              this.clear();
          }
          else {
              let state = 0;
              this._selectionCount = 0;
              this._.forEach((value, key) => {
                  if (state === 1) { // in progress
                      if (item === key || this.lastSelection === key) { // signifies end of range choice
                          state = -1;
                      }
                      if (this.lastSelection === undefined) {
                          state = -1;
                          value = { filtered: true, selected: false };
                      }
                      else {
                          value = { filtered: false, selected: true };
                          ++this._selectionCount;
                      }
                  }
                  else if (state === 0) { // pending
                      if (item === key || this.lastSelection === key) {
                          state = 1;
                          value = { filtered: false, selected: true };
                          ++this._selectionCount;
                      }
                      else {
                          value = { filtered: true, selected: false };
                      }
                  }
                  else { // stopped
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
      toggleSingle(item) {
          const state = this._.get(item);
          if (state) {
              if (state.selected) {
                  this.clear();
              }
              else {
                  this._.forEach((value, key) => {
                      if (item === key) {
                          value.selected = !value.selected;
                          value.filtered = !value.selected;
                      }
                      else {
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

  /**
   * returns a set (unique) of values from an array
   * @param a - array of values
   */
  function uniqueArray(a) {
      if (Array.isArray(a)) {
          const r = new Set();
          a.map(a => r.add(JSON.stringify(a)));
          const ar = [];
          r.forEach(v => ar.push(JSON.parse(v)));
          return ar;
      }
      else {
          return a;
      }
  }

  exports.Queue = Queue;
  exports.Slicer = Slicer;
  exports.deepCopy = deepCopy;
  exports.uniqueArray = uniqueArray;

  return exports;

}({}));
