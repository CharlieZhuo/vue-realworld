<template>
  <ul class="pagination" v-if="pageCount > 1">
    <li
      class="page-item"
      v-for="i in pageCount"
      :key="i"
      :class="{ active: i === prop.currentPage }"
    >
      <a
        :aria-label="`Go to page ${i}`"
        class="page-link"
        href="javascript:"
        @click="emit('pageChange', i)"
        >{{ i }}</a
      >
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from "vue";

const prop = defineProps<{
  total: number;
  pageSize: number;
  currentPage: number;
}>();

const emit = defineEmits<{
  (e: "pageChange", to: number): void;
}>();

const pageCount = computed(() => {
  return Math.ceil(prop.total / prop.pageSize);
});
</script>
