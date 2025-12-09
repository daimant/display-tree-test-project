<script setup lang="ts">
import ExampleComponent from "./ExampleComponent.vue";
import { ref } from "vue";
import { TreeItem } from "../lib/TreeStore.ts";

const emits = defineEmits<{ (e: 'treeDisplay', items: TreeItem[]): void }>()

const input = ref("");
const isShowTree = ref(false);

const parseItems = (raw: string): TreeItem[] => {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Пустая строка");

  const normalized = trimmed
    .replace(/(['"])?([a-zA-Z0-9_]+)\1\s*:/g, '"$2":')
    .replace(/'/g, '"')
    .replace(/,\s*([}\]])/g, "$1");

  const parsed = JSON.parse(normalized);
  if (!Array.isArray(parsed)) {
    throw new Error("Ожидается массив объектов");
  }
  return parsed as TreeItem[];
};

function clickHandler() {
  try {
    emits('treeDisplay', parseItems(input.value));
    isShowTree.value = true;
  } catch (err) {
    console.error(err);
    alert("Вставьте валидный массив с объектами");
  }
}

function enterExampleHandler(exampleInput: string) {
  input.value = exampleInput
  clickHandler()
}
</script>

<template>
  <section class="form">
    <label class="label">Вставьте массив объектов</label>
    <textarea
      v-model="input"
      class="textarea"
      type="text"
      placeholder="Введите валидное дерево элементов"
    />
    <button class="button" @click="clickHandler">Нарисовать</button>

    <example-component @enter="enterExampleHandler"/>
  </section>
</template>

<style scoped>

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
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

</style>