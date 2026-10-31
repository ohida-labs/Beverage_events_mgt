import { Form } from "react-router";

export default function DeactivateUserAccount() {
  return (
    <section className="card space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Deactivate account</h2>
        <p className="text-sm text-gray-500">
          Account deactivation may affect your bookings and access. Contact an
          administrator if you are unsure.
        </p>
      </div>

      <Form
        method="post"
        onSubmit={(event: React.SyntheticEvent) => {
          if (
            !window.confirm("Are you sure you want to deactivate your account?")
          ) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="intent" value="deactivate_account" />
        <button
          type="submit"
          className="submit_button cursor-pointer bg-danger text-white font-medium rounded-none"
        >
          Deactivate account
        </button>
      </Form>
    </section>
  );
}
