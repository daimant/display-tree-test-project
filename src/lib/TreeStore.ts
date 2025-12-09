export type IdType = string | number;

export type TreeItem = {
  id: IdType;
  parent: IdType | null;
  [key: string]: unknown;
};

export class TreeStore {
  private items: TreeItem[];
  private byId: Map<IdType, TreeItem>;
  private children: Map<IdType | null, IdType[]>;

  constructor(items: TreeItem[]) {
    this.items = [];
    this.byId = new Map();
    this.children = new Map();
    items.forEach((item) => this.addItem(item));
  }

  getAll(): TreeItem[] {
    return this.items.slice();
  }

  getItem(id: IdType): TreeItem | undefined {
    return this.byId.get(id);
  }

  getChildren(id: IdType): TreeItem[] {
    const ids = this.children.get(id);
    if (!ids) return [];
    return ids.map((childId) => this.byId.get(childId)).filter(Boolean) as TreeItem[];
  }

  getAllChildren(id: IdType): TreeItem[] {
    const stack = [...this.getChildren(id)];
    const result: TreeItem[] = [];
    while (stack.length) {
      const current = stack.shift() as TreeItem;
      result.push(current);
      const next = this.getChildren(current.id);
      if (next.length) stack.push(...next);
    }
    return result;
  }

  getAllParents(id: IdType): TreeItem[] {
    const start = this.byId.get(id);
    if (!start) return [];
    const chain: TreeItem[] = [];
    let current: TreeItem | undefined = start;
    while (current) {
      chain.push(current);
      const parentId: IdType | null = current.parent;
      current = parentId === null ? undefined : this.byId.get(parentId);
    }
    return chain;
  }

  addItem(item: TreeItem): void {
    if (this.byId.has(item.id)) return;
    this.items.push(item);
    this.byId.set(item.id, item);
    const list = this.children.get(item.parent ?? null) ?? [];
    list.push(item.id);
    this.children.set(item.parent ?? null, list);
    if (!this.children.has(item.id)) this.children.set(item.id, []);
  }

  removeItem(id: IdType): void {
    if (!this.byId.has(id)) return;
    const toRemove = new Set<IdType>();
    const queue: IdType[] = [id];
    while (queue.length) {
      const current = queue.shift() as IdType;
      if (toRemove.has(current)) continue;
      toRemove.add(current);
      const kids = this.children.get(current);
      if (kids) queue.push(...kids);
    }
    this.items = this.items.filter((item) => !toRemove.has(item.id));
    toRemove.forEach((removeId) => {
      const item = this.byId.get(removeId);
      this.byId.delete(removeId);
      const parentId = item?.parent ?? null;
      const siblings = this.children.get(parentId);
      if (siblings) {
        this.children.set(
          parentId,
          siblings.filter((childId) => childId !== removeId)
        );
      }
      this.children.delete(removeId);
    });
  }

  updateItem(updated: TreeItem): void {
    const existing = this.byId.get(updated.id);
    if (!existing) return;
    if (existing.parent !== updated.parent) {
      const oldParent = existing.parent ?? null;
      const oldSiblings = this.children.get(oldParent);
      if (oldSiblings) {
        this.children.set(
          oldParent,
          oldSiblings.filter((childId) => childId !== updated.id)
        );
      }
      const newParent = updated.parent ?? null;
      const newSiblings = this.children.get(newParent) ?? [];
      newSiblings.push(updated.id);
      this.children.set(newParent, newSiblings);
    }
    this.byId.set(updated.id, updated);
    const index = this.items.findIndex((item) => item.id === updated.id);
    if (index !== -1) this.items.splice(index, 1, updated);
  }
}

export default TreeStore;

