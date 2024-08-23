<template>
  <div class="article-meta">
    <RouterLink
      :to="{ name: 'profile', params: { username: author.username } }"
    >
      <img :src="author.image" />
    </RouterLink>
    <div class="info">
      <RouterLink
        :to="{ name: 'profile', params: { username: author.username } }"
        class="author"
      >
        {{ author.username }}
      </RouterLink>
      <span class="date">{{
        new Date(article.createdAt).toLocaleDateString()
      }}</span>
    </div>

    <FollowButton
      :author="author"
      @author-change="(author) => emits('authorChange', author)"
    />
    &nbsp;
    <FavoriteButton
      :article="article"
      @article-change="(article) => emits('articleChange', article)"
    />
    <RouterLink
      class="btn btn-sm btn-outline-primary"
      v-if="doDisplayEditButton"
      :to="{
        name: 'edit-article',
        params: { articleId: article.slug },
      }"
    >
      <i class="ion-edit space" /> Edit Article</RouterLink
    >
  </div>
</template>
<script setup lang="ts">
import { computed, inject } from "vue";
import { components } from "../api/schema";
import { UserKey } from "../plugins/UserManager";
import FollowButton from "./FollowButton.vue";
import FavoriteButton from "./FavoriteButton.vue";
type articleType = components["schemas"]["Article"];

const userInject = inject(UserKey);
const doDisplayEditButton = computed(() => {
  if (userInject?.CurrentUser.value) {
    return userInject.CurrentUser.value.username === article.author.username;
  }
  return false;
});

const { article } = defineProps<{
  article: articleType;
}>();

const emits = defineEmits<{
  (e: "articleChange", article: articleType): void;
  (e: "authorChange", author: components["schemas"]["Profile"]): void;
}>();

const author = computed(() => {
  return article.author;
});
</script>
