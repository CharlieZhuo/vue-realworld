<template>
  <div class="col-md-3">
    <div class="sidebar">
      <p>Popular Tags</p>
      <div class="tag-list">
        <RouterLink
          v-for="tag in props.tags"
          :key="tag"
          :to="{ name: 'tag-feeds', params: { tag } }"
          class="tag-pill tag-default"
        >
          {{ tag }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tags: string[];
}>();
</script>
