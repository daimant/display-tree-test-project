<script setup lang="ts">
import TreeGrid from "./components/TreeGrid.vue";
import { ref } from "vue";
import { TreeItem } from "./lib/TreeStore.ts";

const input = ref("");
const items = ref<TreeItem[]>([]);
const isShowTree = ref(false);

const parseItems = (raw: string): TreeItem[] => {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Пустая строка");

  // Приводим к JSON: заменяем одинарные кавычки и некавыченные ключи.
  const normalized = trimmed
    .replace(/(['"])?([a-zA-Z0-9_]+)\1\s*:/g, '"$2":') // ключи в кавычки
    .replace(/'/g, '"') // одинарные кавычки в двойные
    .replace(/,\s*([}\]])/g, "$1"); // убираем лишние запятые перед скобками

  const parsed = JSON.parse(normalized);
  if (!Array.isArray(parsed)) {
    throw new Error("Ожидается массив объектов");
  }
  return parsed as TreeItem[];
};

function clickHandler() {
  try {
    items.value = parseItems(input.value);
    isShowTree.value = true;
  } catch (err) {
    console.error(err);
    alert("Вставьте валидный массив с объектами");
  }
}

</script>

<template>
  <main class="page">
    <h1>Tree Store</h1>

    <div v-if="!isShowTree" class="form">
      <label class="label">Вставьте массив объектов</label>
      <textarea
        v-model="input"
        class="textarea"
        type="text"
        placeholder="Введите валидное дерево элементов"
      />
      <button class="button" @click="clickHandler">Нарисовать</button>

      <p class="hint">пример:</p>
      <pre class="sample">[
  { id: 1, parent: null, label: "Айтем 1" },
  { id: "91064cee", parent: 1, label: "Айтем 2" },
  { id: 3, parent: 1, label: "Айтем 3" },
  { id: 4, parent: "91064cee", label: "Айтем 4" },
  { id: 5, parent: "91064cee", label: "Айтем 5" },
  { id: 6, parent: "91064cee", label: "Айтем 6" },
  { id: 7, parent: 4, label: "Айтем 7" },
  { id: 8, parent: 4, label: "Айтем 8" }
]</pre>
    </div>

    <TreeGrid v-else :items="items"/>
  </main>
</template>

<style scoped>
.page {
  padding: 16px;
}

h1 {
  margin: 0 0 12px;
  font-size: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 760px;
}

.label {
  font-weight: 600;
  color: #202020;
}

.textarea {
  min-height: 180px;
  padding: 12px;
  border: 1px solid #d0d7de;
  border-radius: 10px;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 14px;
  line-height: 1.5;
  background: #f9fbfd;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  resize: vertical;
}

.textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  background: #fff;
}

.button {
  align-self: flex-start;
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(90deg, #2563eb, #4f46e5);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.25);
  transition: transform 0.1s ease, box-shadow 0.15s ease, opacity 0.15s ease;
}

.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(37, 99, 235, 0.35);
}

.button:active {
  transform: translateY(0);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
}

.hint {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 13px;
}

.sample {
  margin: 0;
  padding: 12px;
  border-radius: 10px;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 13px;
  line-height: 1.5;
  overflow-x: auto;
}
</style>

