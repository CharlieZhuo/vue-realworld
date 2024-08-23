<template>
  <button
    :aria-label="article.favorited ? 'Unfavorite article' : 'Favorite article'"
    class="btn btn-sm pull-xs-right"
    :class="{
      'btn-primary': article.favorited,
      'btn-outline-primary': !article.favorited,
    }"
    :disabled="isFavoriteProcessing"
    @click="onFavButtonClick"
  >
    <i class="ion-heart"></i> {{ article.favoritesCount }}
  </button>
</template>

<script setup lang="ts">
import { components } from "../api/schema";
import { useFavorite } from "../composable/useFavorite";

const { article } = defineProps<{
  article: components["schemas"]["Article"];
}>();

const {
  isProcessing: isFavoriteProcessing,
  startFavorite,
  startUnFavorite,
} = useFavorite(article.slug);

async function onFavButtonClick() {
  let result: undefined | components["schemas"]["Article"];
  if (article.favorited) {
    result = await startUnFavorite();
  } else {
    result = await startFavorite();
  }
  if (result) {
    emits("articleChange", result);
  }
}
const emits = defineEmits<{
  (e: "articleChange", article: components["schemas"]["Article"]): void;
}>();
</script>
