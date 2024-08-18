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
      <span class="date">{{ article.createdAt }}</span>
    </div>

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
    &nbsp;
    <button
      class="btn btn-sm"
      :class="{
        'btn-outline-primary': !article.favorited,
        'btn-primary': article.favorited,
      }"
      :disabled="isFavoriteProcessing"
      @click="onFavButtonClick"
    >
      <i class="ion-heart"></i>
      &nbsp; Favorite Post
      <span class="counter">({{ article.favoritesCount }})</span>
    </button>
  </div>
</template>
<script setup lang="ts">
import { components } from "../api/schema";
import { useFavorite } from "../composable/useFavorite";
import { useFollow } from "../composable/useFollow";
type articleType = components["schemas"]["Article"];

const { article } = defineProps<{
  article: articleType;
}>();

const emits = defineEmits<{
  (e: "articleChange", article: articleType): void;
  (e: "authorChange", author: components["schemas"]["Profile"]): void;
}>();

const author = article.author;
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
</script>
