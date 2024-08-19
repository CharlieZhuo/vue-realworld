<template>
  <div class="article-page" v-if="article">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>

        <ArticleMeta
          :article="article"
          @author-change="changeAuthor"
          @article-change="changeArticle"
        />
      </div>
    </div>

    <div class="container page">
      <ArticleContent :contentMD="article.body" />

      <hr />

      <div class="article-actions">
        <ArticleMeta
          :article="article"
          @author-change="changeAuthor"
          @article-change="changeArticle"
        />
      </div>

      <CommentManager :article-slug="article.slug" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { components } from "../api/schema";
import ArticleMeta from "../components/ArticleMeta.vue";
import { useOneArticle } from "../composable/useOneArticle";
import CommentManager from "../components/CommentManager.vue";
import ArticleContent from "../components/ArticleContent.vue";

const { slug } = defineProps<{
  slug: string;
}>();

const { article, changeArticle, changeAuthor } = useOneArticle(slug);
</script>
