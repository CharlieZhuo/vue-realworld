<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <FeedToggle :feedMode="props.feedMode" />

          <ArticlePreview
            v-for="article in articles"
            :key="article.slug"
            :article="article"
          />

          <Pagination
            :total="totalArticles"
            :current-page="currentPage"
            :page-size="defaultPageSize"
            @page-change="changePage"
          />
        </div>
        <TagList :tags="tags" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import FeedToggle from "../components/FeedToggle.vue";
import Pagination from "../components/Pagination.vue";
import ArticlePreview from "../components/ArticlePreview.vue";

const props = defineProps({
  feedMode: {
    type: String,
    default: "global",
  },
});

import { useArticles } from "../composable/useArticles";
import { defaultPageSize } from "../api/apiClient";
import { useTags } from "../composable/useTags";
import TagList from "../components/TagList.vue";
import { watch } from "vue";

const { articles, totalArticles, changePage, currentPage, changeFeedMode } =
  useArticles({
    feedMode: props.feedMode,
  });
watch(
  () => props.feedMode,
  (newVal) => {
    changeFeedMode(newVal);
  }
);

const { tags } = useTags();
</script>
