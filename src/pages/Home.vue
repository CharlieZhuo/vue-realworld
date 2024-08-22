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
          <FeedToggle :tag-name="props.tagName"/>

          <ArticlePreview
            v-if="!isArticlesLoading"
            v-for="article in articles"
            :key="article.slug"
            :article="article"
          />
          <div class="article-preview" v-if="isArticlesLoading">
            Loading articles
          </div>

          <Pagination
            :total="totalArticles"
            :current-page="currentPage"
            :page-size="defaultPageSize"
            @page-change="changePage"
          />
        </div>
        <TagList :tags="tags" :loading="isTagsLoading" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import FeedToggle from "../components/FeedToggle.vue";
import Pagination from "../components/Pagination.vue";
import ArticlePreview from "../components/ArticlePreview.vue";

const props = defineProps({
  myFeed: {
    type: Boolean,
    default: false,
  },
  tagName: {
    type: String,
    required: false,
  },
});

import { useArticles } from "../composable/useArticles";
import { defaultPageSize } from "../api/apiClient";
import { useTags } from "../composable/useTags";
import TagList from "../components/TagList.vue";
import { watch } from "vue";

const {
  articles,
  totalArticles,
  isProcessing: isArticlesLoading,
  currentPage,
  changePage,
  changeSetting,
} = useArticles({
  myFeed: props.myFeed,
  tagName: props.tagName,
});

watch(
  () => props,
  (newProp) => {
    changeSetting({ tagName: newProp.tagName, myFeed: newProp.myFeed });
  },
  { deep: true }
);

const { tags, isProcessing: isTagsLoading } = useTags();
</script>
