export default function ({ route, redirect }) {
  if (route.path.includes("//") === true) {
    return redirect("/");
  }
}
