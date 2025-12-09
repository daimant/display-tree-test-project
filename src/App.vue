<script setup lang="ts">
import TreeGrid from "./components/TreeGrid.vue";
import { ref } from "vue";
import { TreeItem } from "./lib/TreeStore.ts";
import FormComponent from "./components/FormComponent.vue";

const items = ref<TreeItem[]>([]);
</script>

<template>
  <main class="page">
    <h1>Tree Store</h1>
    <form-component v-if="!items.length" @tree-display="(inputItems) => items = inputItems"/>
    <tree-grid v-else :items="items"/>
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

</style>

