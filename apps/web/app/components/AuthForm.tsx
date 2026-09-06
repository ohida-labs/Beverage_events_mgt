import { Form } from "react-router";
export default function AuthForm({
  title,
  type,
}: {
  title: string;
  type?: "signup" | "login";
}) {
  return (
    <div>
      <h1>{title}</h1>
      <Form method="post">
        {type === "signup" && <input name="fullname" type="text" />}
        <input name="email" type="email" />
        <input name="password" type="password" />
        <button>Submit</button>
      </Form>
    </div>
  );
}
