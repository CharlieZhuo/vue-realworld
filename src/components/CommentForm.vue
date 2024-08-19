<template>
  <form class="card comment-form">
    <div class="card-block">
      <textarea
        class="form-control"
        placeholder="Write a comment..."
        rows="3"
        v-model="commentContent"
      ></textarea>
    </div>
    <div class="card-footer">
      <img :src="authorImage" class="comment-author-img" />
      <button
        class="btn btn-sm btn-primary"
        @click="startProcess"
        :disabled="isProcessing"
      >
        Post Comment
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, inject, ref } from "vue";
import { UserKey } from "../plugins/UserManager";
import { ApiClient } from "../api/apiClient";
import { useAsync } from "../composable/useAsync";
import { components } from "../api/schema";

const userInject = inject(UserKey);
const authorImage = computed(() => {
  return userInject?.CurrentUser.value?.image!;
});

const commentContent = ref("");

const emits = defineEmits<{
  (e: "commentAdded", comment: components["schemas"]["Comment"]): void;
}>();

const { articleSlug: slug } = defineProps<{ articleSlug: string }>();

async function onCommentSubmit() {
  const { data } = await ApiClient.POST("/articles/{slug}/comments", {
    params: { path: { slug: slug } },
    body: { comment: { body: commentContent.value } },
  });
  if (!data) {
    throw new Error("Failed to post comment");
  }
  emits("commentAdded", data.comment);
  commentContent.value = "";
  return data.comment;
}
const { isProcessing, startProcess } = useAsync(onCommentSubmit);
</script>
