<template>
  <nav
    ref="navMenu"
    class="fixed z-40 w-full transition-all duration-500 bg-white"
  >
    <div
      class="page-padding page-width flex items-center justify-end lg:justify-start"
    >
      <div class="items-center flex-1 hidden lg:flex">
        <NuxtLink
          v-for="(link, index) in navLinks"
          :key="index"
          :to="link.url"
          class="nav-link whitespace-nowrap first:-ml-6"
          :class="[
            {
              'nav-link--active': isLinkActive(link.url),
              'nav-link--cta': link.isCtaButton === true,
            },
          ]"
          ><span class="link-name">{{ link.text }}</span></NuxtLink
        >
      </div>
      <button
        v-show="isMobileMenuVisible === false"
        class="flex items-center lg:hidden"
        @click="openMobileMenu"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          class="w-8 h-8"
        >
          <path
            fill="currentColor"
            d="M442 114H6a6 6 0 0 1-6-6V84a6 6 0 0 1 6-6h436a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6zm0 160H6a6 6 0 0 1-6-6v-24a6 6 0 0 1 6-6h436a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6zm0 160H6a6 6 0 0 1-6-6v-24a6 6 0 0 1 6-6h436a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6z"
          ></path>
        </svg>
      </button>
      <div v-show="isMobileMenuVisible === true" class="mobile-menu">
        <div class="flex flex-col mobile-menu-inner">
          <div class="flex justify-end pb-4">
            <button
              class="flex items-center w-6 h-6 mt-8"
              @click="closeMobileMenu"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                class="w-full"
              >
                <path
                  fill="currentColor"
                  d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z"
                  class=""
                ></path>
              </svg>
            </button>
          </div>
          <NuxtLink
            v-for="(link, index) in navLinks"
            :key="index"
            :to="link.url"
            class="flex nav-link--mobile"
            :class="[
              {
                'nav-link--active': isLinkActive(link.url),
                'nav-link--cta': link.isCtaButton === true,
              },
            ]"
            ><span class="link-name">{{ link.text }}</span></NuxtLink
          >
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isMobileMenuVisible: false,
      navLinks: [
        {
          text: "My story",
          url: "/#my-story",
        },
        {
          text: "Career",
          url: "/#career",
        },
        {
          text: "Expertise",
          url: "/#expertise",
        },
        {
          text: "Contact",
          url: "/#contact",
        },
      ],
    };
  },
  watch: {
    $route() {
      this.isMobileMenuVisible = false;
    },
  },
  methods: {
    openMobileMenu() {
      this.isMobileMenuVisible = true;
    },
    closeMobileMenu() {
      this.isMobileMenuVisible = false;
    },
    handleMobileLinkClick(linkUrl) {
      this.$router.push(linkUrl);
    },
    isLinkActive(link) {
      return this.$route.path === link;
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-link--active {
  .link-name {
    @apply border-b-2;
    @apply border-red;
  }

  &.nav-link--cta {
    .link-name {
      @apply border-red;
    }
  }
}

.nav-link {
  @apply px-4;
  @apply font-medium;

  .link-name:hover,
  .link-name:active {
    @apply border-b-2;
    @apply border-red;
  }
}

.nav-link--mobile {
  @apply py-3;
  @apply font-medium;
  @apply text-xl;
}

.nav-link--cta {
  @apply text-white;
  @apply bg-red;
  @apply py-2;
  @apply ml-4;

  &.nav-link--mobile {
    @apply ml-0;
    @apply px-2;
    @apply self-start;
  }
}

.mobile-menu {
  @apply absolute;
  @apply inset-0;
  @apply w-screen;
  @apply h-screen;
  @apply pl-16;
  @apply pr-14;
  @apply sm:pr-20;
  @apply bg-white;
  @apply text-black;
  @apply overscroll-contain;
  @apply z-10;
  @apply overflow-auto;
  @apply overscroll-contain;
}

.mobile-menu-inner {
  /* 
    HACK: When overscroll-contain class is set,
    and the height is 1px more than the viewport,
    the overscroll-contain will prevent the body
    from scrolling when the menu is open.

    This prevents the need for any body classes.
  */
  height: calc(100vh + 1px);
}
</style>
