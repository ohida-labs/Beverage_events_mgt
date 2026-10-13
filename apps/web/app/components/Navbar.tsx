import { Link, NavLink, useRouteLoaderData } from "react-router";
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
            to="/dashboard/"
            className={(prop: isActiveProp) =>
              `${prop.isActive && "text-primary"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard/events"
            className={(prop: isActiveProp) =>
              `${prop.isActive && "text-primary"}`
            }
          >
            Events
          </NavLink>

          <NavLink
            to="/dashboard/settings"
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
