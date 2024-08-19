<template>
  <div class="row article-content">
    <div class="col-md-12" v-html="htmlOutput"></div>
  </div>
</template>

<script setup lang="ts">
import { marked } from "marked";
import { ref, watch } from "vue";

const { contentMD } = defineProps<{
  contentMD: string;
}>();

const htmlOutput = ref<string>();

watch(
  () => contentMD,
  () => {
    const markedOutput = marked.parse(contentMD);
    if (typeof markedOutput == "string") {
      htmlOutput.value = markedOutput;
    } else {
      markedOutput.then((result) => (htmlOutput.value = result));
    }
  },
  {
    immediate: true,
  }
);
</script>
