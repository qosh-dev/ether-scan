export class Iterator<T> {
  private _index: number;
  private _array: T[];
  private usedItems: Set<T>;

  public get isEachProviderUsed() {
    return this.usedItems.size === this._array.length;
  }

  public get size() {
    return this.usedItems.size;
  }

  constructor(array: T[]) {
    this._index = -1;
    this._array = array;
    this.usedItems = new Set<T>();
  }

  setUsed(item: T) {
    this.usedItems.add(item);
  }

  next() {
    this._index = (this._index + 1) % this._array.length;
    return this._array[this._index];
  }
}
