<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign up</h1>
          <p class="text-xs-center">
            <RouterLink :to="{ name: 'login' }">Have an account?</RouterLink>
          </p>

          <ul class="error-messages">
            <li>That email is already taken</li>
          </ul>

          <form ref="formRef" @submit.prevent="onSubmit">
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
              <input
                class="form-control form-control-lg"
                type="email"
                placeholder="Email"
                v-model="formState.email"
                readonly
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                v-model="formState.password"
                minlength="8"
                required
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right" type="submit">
              Sign up
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
type RegisterType = components["schemas"]["NewUser"];
import { useRouter } from "vue-router";
import { AppRouteNames } from "../router";
import { UserKey } from "../plugins/UserManager";
import { getApiClient } from "../api/apiClient";

const router = useRouter();
const userInject = inject(UserKey);

const formState = ref<RegisterType>({
  username: "",
  email: "",
  password: "",
});
const errorMessages = ref<string[]>([]);

const formRef = ref<HTMLFormElement | null>(null);

function onSubmit() {
  if (!formRef.value?.checkValidity()) {
    errorMessages.value.push("Invalid form data");
    return;
  }
  errorMessages.value = [];
  getApiClient()
    .POST("/users", { body: { user: formState.value } })
    .then((rawResponse) => {
      if (!rawResponse.data) {
        errorMessages.value.push(rawResponse.response.statusText);
        return;
      } else {
        const user = rawResponse.data.user;
        if (userInject) userInject.UpdateCurrentUser(user);
        router.push({ name: "home" as AppRouteNames });
      }
    });
}
</script>
