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
                v-model="loginFormState.email"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                required
                type="password"
                placeholder="Password"
                v-model="loginFormState.password"
              />
            </fieldset>
            <button
              :disabled="isProcessing"
              class="btn btn-lg btn-primary pull-xs-right"
              type="submit"
            >
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
import { UserKey } from "../plugins/UserManager";
import { useRouter } from "vue-router";
import { useLogIn } from "../composable/useLogIn";

const router = useRouter();
const userInject = inject(UserKey);

const { isProcessing, loginFormState, startProcess: startLogin } = useLogIn();
const formRef = ref<HTMLFormElement | null>(null);
const errorMessages = ref<string[]>([]);

async function onSubmit() {
  try {
    const resultUser = await startLogin();
    errorMessages.value.push("Login success");
    if (userInject) {
      userInject.UpdateCurrentUser(resultUser);
    }
    router.push({ name: "home" });
  } catch (error) {
    console.error(error);
    errorMessages.value.push((error as Error).message);
  }
}
</script>
