<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row" v-if="!isProfileProcessing && profile">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <FollowButton :author="profile" />
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

          <div class="article-preview" v-if="isArticleProcessing">
            Loading articles
          </div>
          <ArticlePreview
            v-if="!isArticleProcessing"
            v-for="article in articles"
            :key="article.slug"
            :article="article"
          />

          <Pagination
            v-if="!isArticleProcessing"
            :total="totalCount"
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
import { useProfile } from "../composable/useProfile";
import FollowButton from "../components/FollowButton.vue";

const props = defineProps<{
  username: string;
  favorites?: boolean;
}>();

const {
  articles,
  currentPage,
  isProcessing: isArticleProcessing,
  totalCount,
  changePage,
  changeSetting,
} = useArticles({
  authorName: props.favorites ? undefined : props.username,
  favoritedBy: props.favorites ? props.username : undefined,
  immediate: true,
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

const { profile, isProcessing: isProfileProcessing } = useProfile(
  props.username
);
</script>
