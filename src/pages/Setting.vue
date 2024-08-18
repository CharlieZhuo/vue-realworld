<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="startProcess">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  v-model="formState.image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="formState.username"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="formState.bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                  v-model="formState.email"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  v-model="formState.password"
                  required
                />
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                type="submit"
                :disabled="isProcessing"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button
            class="btn btn-outline-danger"
            aria-label="Logout"
            @click="logout"
          >
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, ref } from "vue";
import { UserKey } from "../plugins/UserManager";
import { useRouter } from "vue-router";

import { components } from "../api/schema";
type profileForm = components["schemas"]["UpdateUser"];

import { ApiClient } from "../api/apiClient";
import { useAsync } from "../composable/useAsync";

const userInject = inject(UserKey);
const router = useRouter();

function logout() {
  if (userInject) {
    userInject.RemoveCurrentUser();
    router.push({ name: "home" });
  }
}
const CurrentUser = computed(() => userInject?.CurrentUser.value);

const initialFormState = CurrentUser.value
  ? {
      image: CurrentUser.value.image || "",
      username: CurrentUser.value.username,
      bio: CurrentUser.value.bio || "",
      email: CurrentUser.value.email,
      password: "",
    }
  : {
      image: "",
      username: "",
      bio: "",
      email: "",
      password: "",
    };
const formState = ref<profileForm>(initialFormState);

function onSubmit() {
  return ApiClient.PUT("/user", { body: { user: formState.value } }).then(
    ({ data, error }) => {
      if (!data || error) {
        console.error(error);
        return;
      } else {
        if (userInject) {
          userInject.UpdateCurrentUser(data.user);
        }
      }
    }
  );
}

const { isProcessing, startProcess } = useAsync(onSubmit);
</script>
