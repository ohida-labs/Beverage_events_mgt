import { Link } from "react-router";
export default function NavigationBar() {
  return (
    <nav className="flex justify-between w-full px-[10%]">
      <div className="flex items-center gap-x-2.5">
        <img width={32} height={32} src="favicon.ico" />
        <h1 className="">Guiness</h1>
      </div>
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
    </nav>
  );
}
