<template>
  <div class="user-info">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <img :src="profile.image" class="user-img" />
          <h4>{{ profile.username }}</h4>
          <p>
            {{ profile.bio }}
          </p>
          <button
            class="btn btn-sm action-btn"
            :class="{
              'btn-primary': profile.following,
              'btn-outline-secondary': !profile.following,
            }"
            :disabled="isProcessing"
            @click="profile.following ? startUnFollow() : startFollow()"
          >
            <i class="ion-plus-round"></i>
            &nbsp; {{ profile.following ? "Unfollow" : "Follow" }}
            {{ profile.username }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { components } from "../api/schema";
import { useFollow } from "../composable/useFollow";
type profileType = components["schemas"]["Profile"];

const { profile } = defineProps<{ profile: profileType }>();

const { isProcessing, startFollow, startUnFollow } = useFollow(
  profile.username
);
</script>
