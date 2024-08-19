<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="startProcess">
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="formState.title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="formState.description"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="formState.body"
                ></textarea>
              </fieldset>
              <!-- API接口中更新文章的请求中不包含tag列表，因此只在创建文章时显示tag编辑UI -->
              <fieldset class="form-group" v-if="!articleToEdit">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="tagInput"
                  @keydown="tagSubmit"
                />
                <div class="tag-list">
                  <span
                    v-if="formState.tagList"
                    v-for="tag in formState.tagList"
                    class="tag-default tag-pill"
                    ><i
                      role="button"
                      tabindex="0"
                      aria-label="Delete tag: sdf"
                      class="ion-close-round"
                      @click="tagDelete(tag)"
                    ></i>
                    {{ tag }}</span
                  >
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="submit"
                :disabled="isProcessing"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { components } from "../api/schema";
import { ApiClient } from "../api/apiClient";
import { useRouter } from "vue-router";
import { useAsync } from "../composable/useAsync";
const router = useRouter();

const { articleToEdit } = defineProps<{
  articleToEdit?: components["schemas"]["Article"];
}>();

const formState = ref<components["schemas"]["NewArticle"]>(
  articleToEdit
    ? {
        title: articleToEdit.title,
        description: articleToEdit.description,
        body: articleToEdit.body,
        tagList: articleToEdit.tagList,
      }
    : {
        title: "",
        description: "",
        body: "",
        tagList: [],
      }
);

const tagInput = ref<string>("");

function tagSubmit(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.preventDefault();
    if (tagInput.value) {
      formState.value.tagList!.push(tagInput.value);
      tagInput.value = "";
    }
  }
}
function tagDelete(tag: string) {
  formState.value.tagList = formState.value.tagList!.filter((t) => t !== tag);
}

function handleSubmit() {
  if (articleToEdit) {
    const { tagList, ...updateArticle } = formState.value;
    return ApiClient.PUT("/articles/{slug}", {
      params: { path: { slug: articleToEdit.slug } },
      body: { article: updateArticle },
    }).then(({ data }) => {
      if (!data) throw new Error("No data returned when updating article");
      router.push({ name: "article", params: { id: data.article.slug } });
    });
  } else {
    return ApiClient.POST("/articles", {
      body: { article: formState.value },
    }).then(({ data }) => {
      if (!data) throw new Error("No data returned when creating article");
      router.push({ name: "article", params: { id: data.article.slug } });
    });
  }
}

const { isProcessing, startProcess } = useAsync(handleSubmit);
</script>
