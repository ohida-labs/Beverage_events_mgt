import {
  type RouteConfig,
  index,
  layout,
  prefix,
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
    route("forgot_pas  csword", "./pages/auth/forgot_password.tsx"),
  ]),

  //Dashboard
  ...prefix("dashboard", [
    layout("./pages/dashboard/dashboard_layout.tsx", [
      index("./pages/dashboard/home.tsx"),

      //ORDERS
      route("orders", "./pages/dashboard/orders/order_root.tsx", [
        index("./pages/dashboard/orders/orders_list.tsx"),
        route("new", "./pages/dashboard/orders/single_order/create_order.tsx"),
        route(
          ":order_id",
          "./pages/dashboard/orders/single_order/view_order.tsx",
        ),
        route(
          ":order_id/edit",
          "./pages/dashboard/orders/single_order/edit_order.tsx",
        ),
      ]),

      //Setting
      //  route("settings", ""),
    ]),
  ]),

  ...prefix("admin", [
    layout("./pages/admin/layout.tsx", [
      //home
      index("./pages/admin/home.tsx"),
    ]),
  ]),
  /*

  
*/

  //]),

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
    */
] satisfies RouteConfig;
