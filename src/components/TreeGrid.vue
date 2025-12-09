<script setup lang="ts">
import { computed, ref } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import TreeStore, { TreeItem } from "../lib/TreeStore";

const { items } = defineProps<{ items: TreeItem[] }>()

const store = new TreeStore(items);

const categoryCellRenderer = (params: any) => {
  const hasChildren = params.node.hasChildren();
  const container = document.createElement("div");
  container.className = "category-cell";
  const toggle = document.createElement("span");

  if (hasChildren) {
    toggle.textContent = params.node.expanded ? "▼" : "▶"
    toggle.className = "toggle-icon"

    container.addEventListener("click", (event) => {
      event.stopPropagation();
      params.node.setExpanded(!params.node.expanded);
      params.api.refreshCells({
        rowNodes: [params.node],
        columns: [params.column.getId()],
        force: true
      });
    });
  }

  const text = document.createElement("span");
  text.textContent = params.value;

  container.append(toggle, text);
  return container;
};

const columnDefs = ref([
  { headerName: "No", valueGetter: "node.rowIndex + 1", width: 90 },
  { headerName: "Категория", field: "category", width: 160, cellRenderer: categoryCellRenderer },
  { headerName: "Название", field: "label", flex: 1 }
]);

const rows = computed(() =>
  store.getAll().map((item) => {
    const chain = store.getAllParents(item.id);
    const labels = chain
      .map((node) => node.label as string)
      .reverse();
    return {
      ...item,
      category: (store.getChildren(item.id).length ? "Группа" : "Элемент") as string,
      path: labels
    };
  })
);

const getDataPath = (data: any) => data.path as string[];
const getRowId = (params: any) => String(params.data.id);
</script>

<template>
  <div class="grid-wrapper">
    <ag-grid-vue
      class="ag-theme-alpine grid"
      :columnDefs
      :rowData="rows"
      :animateRows="true"
      :treeData="true"
      groupDisplayType='custom'
      :groupDefaultExpanded="999"
      :getDataPath
      :getRowId
    />
  </div>
</template>

<style scoped>
.grid-wrapper {
  height: calc(100vh - 72px);
}

.grid {
  width: 100%;
  height: 100%;
}

.category-cell {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.toggle-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: #eef2ff;
  color: #4338ca;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.toggle-icon:hover {
  background: #e0e7ff;
}

</style>

