const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", name: "Home", component: () => import("pages/Index.vue") },
      { path: "signin", component: () => import("pages/SignIn.vue") },
      { path: "signup", component: () => import("pages/SignUp.vue") },
      { path: "ratings", component: () => import("pages/Ratings.vue") },
      { path: "recent", component: () => import("pages/Recent.vue") },
      { path: "show", component: () => import("pages/Show.vue") },
      { path: "addrating", component: () => import("pages/AddRating.vue") }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
