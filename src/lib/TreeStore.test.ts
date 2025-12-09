import { describe, expect, it } from "vitest";
import { TreeStore, TreeItem } from "./TreeStore";

const source: TreeItem[] = [
  { id: 1, parent: null, label: "root" },
  { id: 2, parent: 1, label: "child-1" },
  { id: 3, parent: 1, label: "child-2" },
  { id: 4, parent: 2, label: "leaf" }
];

describe("TreeStore", () => {
  it("returns all items", () => {
    const store = new TreeStore(source);
    expect(store.getAll().length).toBe(4);
  });

  it("returns item by id", () => {
    const store = new TreeStore(source);
    expect(store.getItem(2)?.label).toBe("child-1");
  });

  it("returns children", () => {
    const store = new TreeStore(source);
    expect(store.getChildren(1).map((i) => i.id)).toEqual([2, 3]);
    expect(store.getChildren(4)).toEqual([]);
  });

  it("returns all descendants", () => {
    const store = new TreeStore(source);
    expect(store.getAllChildren(1).map((i) => i.id)).toEqual([2, 3, 4]);
  });

  it("returns parents chain", () => {
    const store = new TreeStore(source);
    expect(store.getAllParents(4).map((i) => i.id)).toEqual([4, 2, 1]);
  });

  it("adds item", () => {
    const store = new TreeStore(source);
    store.addItem({ id: 5, parent: 2, label: "new" });
    expect(store.getChildren(2).map((i) => i.id)).toEqual([4, 5]);
  });

  it("updates item", () => {
    const store = new TreeStore(source);
    store.updateItem({ id: 4, parent: 1, label: "moved" });
    expect(store.getChildren(1).map((i) => i.id)).toContain(4);
    expect(store.getChildren(2).map((i) => i.id)).toEqual([]);
  });

  it("removes item with descendants", () => {
    const store = new TreeStore(source);
    store.removeItem(2);
    expect(store.getAll().map((i) => i.id)).toEqual([1, 3]);
    expect(store.getChildren(1).map((i) => i.id)).toEqual([3]);
  });
});

