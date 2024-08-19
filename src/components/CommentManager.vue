<template>
  <div class="row">
    <div class="col-xs-12 col-md-8 offset-md-2">
      
      <CommentForm
        :article-slug="articleSlug"
        @comment-added="(comment) => addCommentLocally(comment)"
      />
      <div v-if="isFetchingComments" class="card">Loading comments...</div>

      <CommentCard
        v-if="!isFetchingComments"
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :article-slug="articleSlug"
        @comment-deleted="(commentId) => removeCommentLocally(commentId)"
      ></CommentCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useComments } from "../composable/useComments";
import CommentCard from "./CommentCard.vue";
import CommentForm from "./CommentForm.vue";

const { articleSlug } = defineProps<{ articleSlug: string }>();

const {
  comments,
  isFetchingComments,
  addCommentLocally,
  removeCommentLocally,
} = useComments(articleSlug);
</script>
