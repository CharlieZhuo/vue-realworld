<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img src="http://i.imgur.com/Qr71crq.jpg" class="user-img" />
            <h4>Eric Simons</h4>
            <p>
              Cofounder @GoThinkster, lived in Aol's HQ for a few months, kinda
              looks like Peeta from the Hunger Games
            </p>
            <button class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-plus-round"></i>
              &nbsp; Follow Eric Simons
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <FeedToggle
            :profile-page="{
              useName: props.username,
              favorited: props.favorites,
            }"
          />

          <div class="article-preview" v-if="isProcessing">
            Loading articles
          </div>
          <ArticlePreview
            v-if="!isProcessing"
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
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useArticles } from "../composable/useArticles";
import FeedToggle from "../components/FeedToggle.vue";
import Pagination from "../components/Pagination.vue";
import ArticlePreview from "../components/ArticlePreview.vue";
import { defaultPageSize } from "../api/apiClient";
import { watch } from "vue";

const props = defineProps<{
  username: string;
  favorites?: boolean;
}>();

const {
  articles,
  changePage,
  currentPage,
  isProcessing,
  totalArticles,
  changeSetting,
} = useArticles({
  authorName: props.favorites ? undefined : props.username,
  favoritedBy: props.favorites ? props.username : undefined,
});

watch(
  () => props,
  (newProp) => {
    changeSetting({
      authorName: newProp.favorites ? undefined : newProp.username,
      favoritedBy: newProp.favorites ? newProp.username : undefined,
    });
  },
  { deep: true }
);
</script>
