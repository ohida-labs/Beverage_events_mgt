/* eslint-disable react-refresh/only-export-components */
import { user_cookie_token } from "../../cookies.server";
import type { Route } from "./+types/login";
import { useFetcher, data, redirect, Link } from "react-router";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  ///Colect fomr details from users
  const email = String(formData.get("email"));
  const fname = String(formData.get("fname"));
  const lname = String(formData.get("lname"));
  const password = String(formData.get("password"));

  const errors = {} as {
    email: string;
    password: string;
    fname: string;
    lname: string;
  };

  //Validate Form;
  if (email && !email.includes("@")) {
    errors.email = "Invalid email address";
  }

  if (fname && fname.trim().length < 3) {
    errors.fname = "Invalid First name format";
  }

  if (lname && lname.trim().length < 3) {
    errors.lname = "Invalid Last name format";
  }

  if (password && password.trim().length < 8) {
    errors.password = "Password should be at least 8 characters";
  }

  //Throw validation error Response
  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 400 });
  }

  //Send credentials to backend server;
  const response = await fetch("http://localhost:8080/v0.1/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      first_name: fname,
      last_name: lname || null,
    }),
  });

  const res = await response.json();

  //Throw database error
  if (!res.status) {
    const { message, statusCode } = res.error;
    return data({ error: message }, { status: statusCode });
  }

  //Success: store token cookie and redirect users
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};
  cookie.token = res?.data?.token;

  return redirect("/", {
    headers: {
      "Set-Cookie": await user_cookie_token.serialize(cookie),
    },
  });
}

export default function RegisterPage() {
  const fetcher = useFetcher();

  //Input validation
  const errors = fetcher.data?.errors;

  //pending
  const pending = fetcher.state !== "idle";

  //Fetcher Data
  const response = fetcher.data;

  return (
    <fetcher.Form className="card mx-auto md:max-w-2xl space-y-6" method="post">
      <header>
        <h2 className="font-semibold text-xl">Join the Guinness Family 🤎</h2>
        <p className="text-gray-400 text-xs">We are here to serve you..</p>
        <p className="mt-3.5 text-xs text-danger">{response?.error}</p>
      </header>

      <div className="space-y-2">
        <label className="block font-medium">First Name</label>
        <input type="text" name="fname" placeholder="Jane" required />
        <p className="text-danger">
          {errors?.fname ? <em>{errors.fname}</em> : null}
        </p>
      </div>
      <div className="space-y-2">
        <label className="block font-medium">Last Name (Optional)</label>
        <input placeholder="Doe" type="text" name="lname" />
        <p className="text-danger">
          {errors?.lname ? <em>{errors.lname}</em> : null}
        </p>
      </div>
      <div className="space-y-2">
        <label className="block font-medium">Email</label>
        <input
          placeholder="janedoe@gunieness.com"

          type="email"
          name="email"
          required
        />
        <p className="text-danger">
          {errors?.email ? <em>{errors.email}</em> : null}
        </p>
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Password</label>
        <input
          type="password"
          name="password"
          placeholder="********"
          required
        />
        <p className="text-danger">
          {errors?.password ? <em>{errors.password}</em> : null}
        </p>
      </div>

      <button
        type="submit"
        className="hover:opacity-90 w-full cursor-pointer submit_button"
      >
        {pending ? "Submitting..." : "Sign up"}
      </button>
      <div className="text-xs text-muted w-full">
        <p className="text-center">
          Already have an Account.{" "}
          <Link className="text-info underline" to="/login">
            Login here
          </Link>
        </p>
      </div>
    </fetcher.Form>
  );
}
