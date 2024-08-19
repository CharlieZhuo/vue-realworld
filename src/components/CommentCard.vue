<template>
  <div class="card">
    <div class="card-block">
      <p class="card-text">
        {{ comment.body }}
      </p>
    </div>
    <div class="card-footer">
      <RouterLink
        :to="{ name: 'profile', params: { username: comment.author.username } }"
        class="comment-author"
      >
        <img :src="comment.author.image" class="comment-author-img" />
      </RouterLink>
      &nbsp;
      <RouterLink
        :to="{ name: 'profile', params: { username: comment.author.username } }"
        class="comment-author"
      >
        {{ comment.author.username }}
      </RouterLink>

      <span class="date-posted">{{ comment.createdAt }}</span>
      <span class="mod-options">
        <i @click="startDelete" class="ion-trash-a" :disable="isProcessing"></i>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ApiClient } from "../api/apiClient";
import { components } from "../api/schema";
import { useAsync } from "../composable/useAsync";
type CommentType = components["schemas"]["Comment"];
const { comment, articleSlug } = defineProps<{
  comment: CommentType;
  articleSlug: string;
}>();

const emits = defineEmits<{
  (e: "comment-deleted", commentId: number): void;
}>();

async function deleteComment() {
  await ApiClient.DELETE("/articles/{slug}/comments/{id}", {
    params: { path: { slug: articleSlug, id: comment.id } },
  });
  emits("comment-deleted", comment.id);
}
const { isProcessing, startProcess: startDelete } = useAsync(deleteComment);
</script>
