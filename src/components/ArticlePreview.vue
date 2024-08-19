<template>
  <div class="article-preview">
    <div class="article-meta">
      <RouterLink
        :to="{
          name: 'profile',
          params: { username: article.author.username },
        }"
      >
        <img :src="article.author.image" />
      </RouterLink>
      <div class="info">
        <RouterLink
          :to="{
            name: 'profile',
            params: { username: article.author.username },
          }"
        >
          {{ article.author.username }}
        </RouterLink>
        <span class="date">{{ new Date( article.createdAt).toLocaleDateString() }}</span>
      </div>
      <button
        :aria-label="
          article.favorited ? 'Unfavorite article' : 'Favorite article'
        "
        class="btn btn-sm pull-xs-right"
        :class="{
          'btn-primary': article.favorited,
          'btn-outline-primary': !article.favorited,
        }"
        :disabled="isProcessing"
        @click="onFavButtonClick"
      >
        <i class="ion-heart"></i> {{ article.favoritesCount }}
      </button>
    </div>
    <RouterLink
      :to="{ name: 'article', params: { id: article.slug } }"
      class="preview-link"
    >
      <h1>{{ article.title }}</h1>
      <p>{{ article.description }}</p>
      <span>Read more...</span>
      <ul class="tag-list">
        <li
          v-for="tag in article.tagList"
          class="tag-default tag-pill tag-outline"
        >
          {{ tag }}
        </li>
      </ul>
    </RouterLink>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { components } from "../api/schema";

const { article: articleProp } = defineProps<{
  article: components["schemas"]["Article"];
}>();

const article = ref(articleProp);

import { useFavorite } from "../composable/useFavorite";
const { isProcessing, startFavorite, startUnFavorite } = useFavorite(
  article.value.slug
);

async function onFavButtonClick() {
  let result:
    | undefined
    | components["schemas"]["Article"];
  if (article.value.favorited) {
    result = await startUnFavorite();
  } else {
    result = await startFavorite();
  }
  if (result) {
    article.value = result;
  }
}
</script>
