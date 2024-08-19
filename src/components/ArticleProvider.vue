<template>
  <slot :article :isProcessing></slot>
</template>
<script setup lang="ts">
import { useOneArticle } from "../composable/useOneArticle";

const { slug } = defineProps<{ slug: string }>();

const { article, isProcessing } = useOneArticle(slug);
</script>
