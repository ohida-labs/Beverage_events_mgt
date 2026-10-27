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
  route("/", "./pages/layout.tsx", [index("./pages/landingpage.tsx")]),

  //auth: /login, /register, /forgot_password
  layout("./pages/auth/layout.tsx", [
    route("login", "./pages/auth/login.tsx"),
    route("register", "./pages/auth/signup.tsx"),
    route("forgot_password", "./pages/auth/forgot_password.tsx"),
  ]),

  //Events Listings (ALL uSERS)
  ...prefix("events", [
    layout("./pages/events/events_root.tsx", [
      // Consumers, Booking manager, admin
      index("./pages/events/all_events.tsx"),
      route("new", "./pages/events/create_event.tsx"),
      route(":event_id", "./pages/events/single_event.tsx"),
      route(":event_id/edit", "./pages/events/edit_event.tsx"),
    ]),
  ]),

  // Distributor ONLY
  route("assigned_events", "./pages/events/assigned_events.tsx"),

  //Settings For (all Users)
  route("settings", "./pages/settings/settings_page.tsx"),

  //HOme: Stat and Quick Links (Consumers Only)
  ...prefix("home", [
    layout("./pages/home/dashboard_layout.tsx", [
      index("./pages/home/dashboard_home.tsx"),
    ]),
  ]),

  //Administrative only
  ...prefix("admin", [
    layout("./pages/admin/layout.tsx", [
      //home
      index("./pages/admin/home.tsx"),

      //all users
      route("users", "./pages/admin/users/all_users.tsx"),
      route("users/:user_id", "./pages/admin/users/user_details.tsx"),

      //all drinks
      route("beverages", "./pages/admin/beverages/all_beverages.tsx"),
      route(
        "beverages/:drink_id",
        "./pages/admin/beverages/beverage_details.tsx",
      ),
    ]),
  ]),
] satisfies RouteConfig;
