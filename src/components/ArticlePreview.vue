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
        <span class="date">{{ article.createdAt }}</span>
      </div>
      <button class="btn btn-outline-primary btn-sm pull-xs-right">
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
import { components } from "../api/schema";

const {article} = defineProps<{ article: components["schemas"]["Article"] }>();
</script>
