import { Form } from "react-router";

export default function DeactivateUserAccount() {
  return (
    <section className="card space-y-3">
      <h2 className="text-lg font-semibold">Deactivate account</h2>
      <p className="text-sm text-gray-500">
        Account deactivation may affect your bookings and access. Contact an
        administrator if you are unsure.
      </p>

      <Form
        method="post"
        onSubmit={(event) => {
          if (
            !window.confirm("Are you sure you want to deactivate your account?")
          ) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="intent" value="deactivate_account" />
        <button type="submit" className="text-red-600">
          Deactivate account
        </button>
      </Form>
    </section>
  );
}
