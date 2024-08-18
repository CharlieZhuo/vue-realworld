<template>
  <div class="col-md-3">
    <div class="sidebar">
      <p>Popular Tags</p>
      <div class="tag-list">
        <RouterLink
          v-if="!props.loading"
          v-for="tag in props.tags"
          :key="tag"
          :to="{ name: 'tag-feeds', params: { tag } }"
          class="tag-pill tag-default"
        >
          {{ tag }}
        </RouterLink>
        <a class="tag-pill tag-default" v-if="props.loading">loading</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tags: string[];
  loading?: boolean;
}>();
</script>
