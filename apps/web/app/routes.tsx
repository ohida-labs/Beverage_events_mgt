import {
  type RouteConfig,
  index,
  layout,
  // prefix,
  route,
} from "@react-router/dev/routes";
export default [
  //Public: landing
  route("/", "./pages/home_layout.tsx", [index("./pages/landingpage.tsx")]),

  //auth: /login, /register, /forgot_password
  layout("./pages/auth/layout.tsx", [
    route("login", "./pages/auth/login.tsx"),
    route("register", "./pages/auth/signup.tsx"),
    route("forgot_password", "./pages/auth/forgot_password.tsx"),
  ]),

  /*
  ...prefix("admin", [
    layout("./pages/admin/layout.tsx", [
      //home
      index("./pages/admin/home.tsx"),

      //cUSTOMERS
      route("customers", "", [
        route(":customer_id", ""),
        route(":customer_id/edit", ""),
      ]),

      //ORDERS
      route("orders", "", [
        route(":order_id", ""),
        route(":order_id/edit", ""),
      ]),

      //Setting
      route("settings", ""),

      //Roles and permission
      route("manage_users", ""),
    ]),

    ...prefix("dashboard", [
      layout("./pages/dashboard/dashboard_layout.tsx", [
        //home
        index("./pages/dashboard/home.tsx"),

        //ORDERS
        route("orders", "", [
          route("create", ""),
          route(":order_id", ""),
          route(":order_id/edit", ""),
        ]),

        //Setting
        route("settings", ""),
      ]),
    ]),
  ]),
  */
] satisfies RouteConfig;
