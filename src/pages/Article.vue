<template>
  <div class="article-page" v-if="article">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>

        <ArticleMeta
          :article="article"
          @author-change="handleAuthorChange"
          @article-change="handleArticleChange"
        />
      </div>
    </div>

    <div class="container page">
      <ArticleContent :contentMD="article.body" />

      <hr />

      <div class="article-actions">
        <ArticleMeta
          :article="article"
          @author-change="handleAuthorChange"
          @article-change="handleArticleChange"
        />
      </div>

      <CommentManager :article-slug="article.slug" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { components } from "../api/schema";
type articleType = components["schemas"]["Article"];
import ArticleMeta from "../components/ArticleMeta.vue";
import { useOneArticle } from "../composable/useOneArticle";
import CommentManager from "../components/CommentManager.vue";
import ArticleContent from "../components/ArticleContent.vue";

const { slug } = defineProps<{
  slug: string;
}>();

const { startProcess } = useOneArticle(slug);

const article = ref<articleType>();
startProcess()
  .then((p) => p)
  .then(
    (fetchedArticle) => {
      article.value = fetchedArticle;
    },
    (error) => {
      console.error(error);
    }
  );

const handleArticleChange = (newArticle: articleType) => {
  article.value = newArticle;
};
const handleAuthorChange = (newAuthor: components["schemas"]["Profile"]) => {
  if (article.value) article.value.author = newAuthor;
};
</script>
