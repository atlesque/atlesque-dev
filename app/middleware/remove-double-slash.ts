export default defineNuxtRouteMiddleware((to) => {
  if (to.path.includes("//") === true) {
    return navigateTo("/");
  }
});
