<template>
  <main class="mb-32">
    <section class="grid grid-cols-1 lg:grid-cols-2 mb-32">
      <div class="flex flex-col mr-8 mb-8">
        <h1 class="headline-xl mb-8">
          Hi, I'm <span class="text-red">Alex</span>ander
        </h1>
        <p class="text-xl mb-8">
          As a freelance software developer, I help you build customer-facing
          software, fully secure and with a smile!
        </p>
        <div class="flex">
          <a href="#my-story" class="button-primary mr-8">Read my story</a>
          <a href="#contact" class="button">Contact me</a>
        </div>
      </div>
      <div class="flex justify-end">
        <NuxtImg
          src="/images/alex-sitting-in-gras-with-camera.png"
          alt="Alex sitting in grass with camera"
          quality="100"
          class="object-contain"
        />
      </div>
    </section>
  </main>
</template>

<script>
export default {
  layout: "fullWidth",
};
</script>
