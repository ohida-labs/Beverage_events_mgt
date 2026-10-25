import { Form } from "react-router";

export default function ChangeUserPassword() {
  return (
    <section className="card space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Change password</h2>
        <p className="text-sm text-gray-500">
          Use your current password to choose a new one.
        </p>
      </div>

      <Form method="post" className="space-y-4">
        <input type="hidden" name="intent" value="change_password" />

        <div>
          <label htmlFor="old_password">Current password</label>
          <input
            id="old_password"
            name="old_password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="new_password">New password</label>
          <input
            id="new_password"
            name="new_password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            className="w-full"
          />
        </div>

        <button type="submit">Change password</button>
      </Form>
    </section>
  );
}
