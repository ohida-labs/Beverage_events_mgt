/* eslint-disable react-refresh/only-export-components */
import { Form } from "react-router";
import type { Route } from "./+types/login";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const name = formData.get("name");
  console.log(name);
  /*
  const response = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Response("Login failed", { status: response.status });
  }

  const data = await response.json();
*/
  return { data: "dasdasd" };
}

export default function LoginPage({ actionData }: Route.ComponentProps) {
  return (
    <main>
      <p>This is the Login page!</p>

      <Form method="post">
        <input type="text" name="name" />
        <button type="submit">Submit</button>
      </Form>

      {actionData ? <p>{actionData.data}</p> : null}
    </main>
  );
}
