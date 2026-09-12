/* eslint-disable react-refresh/only-export-components */
import { user_cookie_token } from "../../cookies.server";
import type { Route } from "./+types/login";
import { useFetcher, data, redirect } from "react-router";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  ///Colect fomr details from users
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const errors = {} as {
    email: string;
    password: string;
  };

  //Validate Form;
  if (email && !email.includes("@")) {
    errors.email = "Invalid email address";
  }

  if (password && password.length < 8) {
    errors.password = "Password should be at least 8 characters";
  }

  //Throw validation error Response
  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 400 });
  }

  //Send credentials to backend server;
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    },
  );

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

export default function LoginPage() {
  const fetcher = useFetcher();

  //Input validation
  const errors = fetcher.data?.errors;

  //pending
  const pending = fetcher.state !== "idle";

  //Fetcher Data
  const response = fetcher.data;

  return (
    <fetcher.Form
      className="card mx-auto md:max-w-[75%] space-y-6"
      method="post"
    >
      <p className="text-danger">{response?.error}</p>
      <div className="space-y-2">
        <label className="block">Email</label>
        <input type="email" name="email" required />
        <p className="text-danger">
          {errors?.email ? <em>{errors.email}</em> : null}
        </p>
      </div>

      <div className="space-y-2">
        <label className="block">Password</label>
        <input type="password" name="password" required />
        <p className="text-danger">
          {errors?.password ? <em>{errors.password}</em> : null}
        </p>
      </div>

      <button type="submit" className="submit_button">
        {pending ? "Submitting..." : "Log in"}
      </button>
    </fetcher.Form>
  );
}
