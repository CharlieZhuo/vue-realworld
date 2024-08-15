<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Log in</h1>
          <p class="text-xs-center">
            <RouterLink :to="{ name: 'register' }">Need an account?</RouterLink>
          </p>

          <ul class="error-messages">
            <li v-for="error in errorMessages" :key="error">{{ error }}</li>
          </ul>

          <form ref="formRef" @submit.prevent="onSubmit">
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                required
                type="email"
                placeholder="Email"
                v-model="formState.email"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                required
                type="password"
                placeholder="Password"
                v-model="formState.password"
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { inject, ref } from "vue";
import { components } from "../api/schema";
type LoginType = components["schemas"]["LoginUser"];
import { getApiClient } from "../api/apiClient";
import { UserKey } from "../plugins/UserManager";
import { useRouter } from "vue-router";
import { AppRouteNames } from "../router";

const router = useRouter();
const userInject = inject(UserKey);
const formState = ref<LoginType>({
  email: "",
  password: "",
});
const formRef = ref<HTMLFormElement | null>(null);
const errorMessages = ref<string[]>([]);

function onSubmit() {
  errorMessages.value = [];
  getApiClient()
    .POST("/users/login", { body: { user: formState.value } })
    .then((rawResponse) => {
      if (rawResponse.response.status !== 200 || !rawResponse.data) {
        errorMessages.value.push(rawResponse.response.statusText);
      } else {
        const user = rawResponse.data.user;
        router.push({ name: "home" as AppRouteNames });
        if (userInject) userInject.UpdateCurrentUser(user);
      }
    })
    .catch((error) => {
      errorMessages.value.push(error.message);
      console.error(error);
    });
}
</script>
