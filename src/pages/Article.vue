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
      <div class="row article-content">
        <div class="col-md-12">
          <p>
            Web development technologies have evolved at an incredible clip over
            the past few years.
          </p>
          <h2 id="introducing-ionic">Introducing RealWorld.</h2>
          <p>It's a great solution for learning how other frameworks work.</p>
        </div>
      </div>

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

const { slug } = defineProps<{
  slug: string;
}>();

const { isProcessing, startProcess } = useOneArticle(slug);

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
