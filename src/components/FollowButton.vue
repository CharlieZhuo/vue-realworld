<template>
  <button
    class="btn btn-sm"
    :class="{
      'btn-outline-secondary': !author.following,
      'btn-secondary': author.following,
    }"
    :disabled="isFollowProcessing"
    @click="onFollowButtonClick"
  >
    <i class="ion-plus-round"></i>
    &nbsp; {{ author.following ? "Unfollow" : "Follow" }}
    {{ author.username }}
  </button>
</template>
<script setup lang="ts">
import { components } from "../api/schema";
import { useFollow } from "../composable/useFollow";

const { author } = defineProps<{
  author: components["schemas"]["Profile"];
}>();

const {
  isProcessing: isFollowProcessing,
  startFollow,
  startUnFollow,
} = useFollow(author.username);

async function onFollowButtonClick() {
  let result: undefined | components["schemas"]["Profile"];
  if (author.following) {
    result = await startUnFollow();
  } else {
    result = await startFollow();
  }
  if (result) {
    emits("authorChange", result);
  }
}
const emits = defineEmits<{
  (e: "authorChange", author: components["schemas"]["Profile"]): void;
}>();
</script>
