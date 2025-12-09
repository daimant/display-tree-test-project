<script setup lang="ts">
const emits = defineEmits<{
  (e: 'enter', exampleInput: string): void
}>()

const exampleText = `[
  { id: 1, parent: null, label: "Айтем 1" },
  { id: "91064cee", parent: 1, label: "Айтем 2" },
  { id: 3, parent: 1, label: "Айтем 3" },
  { id: 4, parent: "91064cee", label: "Айтем 4" },
  { id: 5, parent: "91064cee", label: "Айтем 5" },
  { id: 6, parent: "91064cee", label: "Айтем 6" },
  { id: 7, parent: 4, label: "Айтем 7" },
  { id: 8, parent: 4, label: "Айтем 8" }
]`
</script>

<template>
  <section class="sample-container">
    <p class="hint">пример:</p>
    <pre class="sample" v-html="exampleText"/>
    <button class="button" @click="emits('enter', exampleText)">Подставить</button>
  </section>
</template>

<style scoped>

.sample-container {
  position: relative;

  .hint {
    margin: 4px 0 12px;
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

  .button {
    position: absolute;
    right: 10px;
    top: 42px;
  }
}

</style>