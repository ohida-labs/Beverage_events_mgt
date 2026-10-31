import { Link, NavLink } from "react-router";
type isActiveProp = {
  isActive: boolean;
};

type User = {
  user_id: string;
  role: string;
};

type Props = {
  user: User | null;
};

const navigationByRole: Record<string, { label: string; to: string }[]> = {
  consumer: [
    { label: "Home", to: "/home" },
    { label: "Events", to: "/events" },
    { label: "Create Event", to: "/events/new" },
    { label: "Account", to: "/settings" },
  ],

  distribution_staff: [
    { label: "Assigned Events", to: "/assigned_events" },
    { label: "Account", to: "/settings" },
  ],

  booking_manager: [
    // { label: "Dashboard", to: "/admin" },
    { label: "Events", to: "/events" },
    // { label: "Users", to: "/admin/users" },
    // { label: "Drinks", to: "/admin/beverages" },
    { label: "Account", to: "/settings" },
  ],

  admin: [
    { label: "Dashboard", to: "/admin" },
    { label: "Events", to: "/events" },
    { label: "Users", to: "/admin/users" },
    { label: "Drinks", to: "/admin/beverages" },
    { label: "Account", to: "/settings" },
  ],
};

export default function NavigationBar({ user }: Props) {
  const navigation = user ? (navigationByRole[user.role] ?? []) : [];

  return (
    <nav className="flex card justify-between w-full py-2 px-[10%]">
      <Link to="/" className="flex items-center gap-x-2.5">
        <img src="/favicon.ico" width={32} height={32} alt="Logo" />
        <h1>Guinness</h1>
      </Link>

      {!user ? (
        <ul className="flex gap-[1.2rem]">
          <li>
            <Link to="/register">Sign Up</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      ) : (
        <ul className="flex items-center gap-[1.2rem]">
          {navigation.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={(prop: isActiveProp) =>
                  `${prop.isActive && "text-primary"}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

/*import { Link, NavLink, useRouteLoaderData } from "react-router";
type isActiveProp = {
  isActive: boolean;
};

export default function NavigationBar() {
  const user = useRouteLoaderData("root");
  return (
    <nav className="flex card justify-between w-full py-2 px-[10%]">
      <div className="flex items-center gap-x-2.5">
        <img width={32} height={32} src="/favicon.ico" />
        <h1 className="">Guiness</h1>
      </div>

      {!user && (
        <ul className="flex gap-[1.2rem]">
          <li>
            <button className="">
              <Link to="/register">Sign Up</Link>
            </button>
          </li>
          <li>
            <button className="">
              <Link to="/login">Login</Link>
            </button>
          </li>
        </ul>
      )}

      {user && (
        <ul className="flex items-center gap-[1.2rem]">
          <NavLink
            to="/admin"
            className={(prop: isActiveProp) =>
              `${prop.isActive && "text-primary"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/events"
            className={(prop: isActiveProp) =>
              `${prop.isActive && "text-primary"}`
            }
          >
            Events
          </NavLink>
          <NavLink
            to="/admin/users"
            className={(prop: isActiveProp) =>
              `${prop.isActive && "text-primary"}`
            }
          >
            Users
          </NavLink>
          <NavLink
            to="/admin/beverages"
            className={(prop: isActiveProp) =>
              `${prop.isActive && "text-primary"}`
            }
          >
            Drinks
          </NavLink>

          <NavLink
            to="/settings"
            className={(prop: isActiveProp) =>
              `${prop.isActive && "text-primary"}`
            }
          >
            Account
          </NavLink>
        </ul>
      )}
    </nav>
  );
}
'*/
