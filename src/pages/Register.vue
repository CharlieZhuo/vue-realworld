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
            <li v-for="error in errorMessages" :key="error">{{ error }}</li>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                v-model="registerFormState.username"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="email"
                placeholder="Email"
                v-model="registerFormState.email"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                v-model="registerFormState.password"
                minlength="8"
                required
              />
            </fieldset>
            <button
              :disabled="isProcessing"
              class="btn btn-lg btn-primary pull-xs-right"
              type="submit"
            >
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
import { useRouter } from "vue-router";
import { AppRouteNames } from "../router";
import { UserKey } from "../plugins/UserManager";
import { useRegister } from "../composable/useRegister";

const router = useRouter();
const userInject = inject(UserKey);

const errorMessages = ref<string[]>([]);

const { isProcessing, registerFormState, startProcess } = useRegister();

async function onSubmit() {
  errorMessages.value = [];

  try {
    const user = await startProcess();
    errorMessages.value.push("Register success");
    if (userInject) userInject.UpdateCurrentUser(user);
    router.push({ name: "home" as AppRouteNames });
  } catch (error) {
    console.error(error);
    errorMessages.value.push((error as Error).message);
  }
}
</script>
