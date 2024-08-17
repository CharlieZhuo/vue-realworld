<template>
  <div class="feed-toggle">
    <ul class="nav nav-pills outline-active">
      <li v-for="tab in tabs" :key="tab.label" class="nav-item">
        <RouterLink
          class="nav-link"
          active-class="active"
          :to="{ name: tab.routeName, params: tab.params }"
          >{{ tab.label }}</RouterLink
        >
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  feedMode: string;
}>();

interface tab {
  routeName: string;
  params?: Record<string, string>;
  label: string;
}
const tabs: tab[] = [
  {
    routeName: "my-feeds",
    label: "Your Feed",
  },
  {
    routeName: "home",
    label: "Global Feed",
  },
];
if (props.feedMode != "global" && props.feedMode != "my") {
  tabs.push({
    routeName: "tag-feeds",
    label: `#${props.feedMode}`,
    params: { tag: props.feedMode },
  });
}
</script>
