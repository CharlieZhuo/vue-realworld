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
import { computed, inject } from "vue";
import { UserKey } from "../plugins/UserManager";

const userInject = inject(UserKey);
const props = defineProps<{
  homePage?: {
    tagName?: string;
  };
  profilePage?: {
    useName: string;
    favorited?: boolean;
  };
}>();

interface tab {
  routeName: string;
  params?: Record<string, string>;
  label: string;
}
const tabs = computed(() => {
  const output: tab[] = [];

  if (props.homePage) {
    output.push({
      routeName: "home",
      label: "Global Feed",
    });
    if (userInject && userInject.CurrentUser.value) {
      output.push({
        routeName: "my-feeds",
        label: "Your Feed",
      });
    }
    if (props.homePage.tagName) {
      output.push({
        routeName: "tag-feeds",
        label: `#${props.homePage.tagName}`,
        params: { tag: props.homePage.tagName },
      });
    }
  } else if (props.profilePage) {
    output.push({
      routeName: "profile",
      label: "My Articles",
      params: { username: props.profilePage.useName },
    });
    output.push({
      routeName: "profile-favorites",
      label: "Favorited Articles",
      params: { username: props.profilePage.useName },
    });
  }
  return output;
});
</script>
