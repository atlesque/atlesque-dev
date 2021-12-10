<template>
  <main class="mx-auto max-w-page page">
    <section class="px-10 pb-16 mx-auto text-center max-w-7xl">
      <h1 class="h1">
        <template v-if="error.message != null">
          {{ error.message }}
        </template>
        <template v-else-if="error.statusCode === 404">Page not found</template
        ><template v-else>Error loading page</template>
      </h1>
      <NuxtLink
        v-if="(error.backButton || {}).url != null"
        :to="error.backButton.url"
        class="button-primary"
      >
        Go back
      </NuxtLink>
      <NuxtLink v-else :to="localePath('/')" class="button-primary"
        >Back home</NuxtLink
      >
    </section>
  </main>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
};
</script>
