<template>
  <ArticleProvider v-if="articleId" :slug="articleId" v-slot="slotProps">
    <p v-if="slotProps.isProcessing">Loading article</p>
    <ArticleForm
      v-if="!slotProps.isProcessing"
      :articleToEdit="slotProps.article"
      :key="slotProps.article?.slug"
    ></ArticleForm>
  </ArticleProvider>
  <ArticleForm key="createNew" v-if="!articleId"></ArticleForm>
</template>
<script setup lang="ts">
import ArticleProvider from "../components/ArticleProvider.vue";

import ArticleForm from "../components/ArticleForm.vue";

const { articleId } = defineProps<{ articleId?: string }>();
</script>
