import { Form } from "react-router";

type EditProfileProps = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};

export default function EditProfile({
  firstName = "",
  lastName = "",
  phoneNumber = "",
}: EditProfileProps) {
  return (
    <section className="card space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Edit profile</h2>
        <p className="text-sm text-gray-500">
          Update your personal information.
        </p>
      </div>

      <Form method="post" className="space-y-4">
        <input type="hidden" name="intent" value="update_profile" />

        <div>
          <label htmlFor="first_name">First name</label>
          <input
            id="first_name"
            name="first_name"
            defaultValue={firstName}
            required
            className="w-full"
            autoComplete="given-name"
          />
        </div>

        <div>
          <label htmlFor="last_name">Last name</label>
          <input
            id="last_name"
            name="last_name"
            defaultValue={lastName}
            required
            className="w-full"
            autoComplete="family-name"
          />
        </div>

        <div>
          <label htmlFor="phone_number">Phone number</label>
          <input
            id="phone_number"
            name="phone_number"
            type="tel"
            defaultValue={phoneNumber}
            className="w-full"
            autoComplete="tel"
          />
        </div>

        <button type="submit">Save changes</button>
      </Form>
    </section>
  );
}
