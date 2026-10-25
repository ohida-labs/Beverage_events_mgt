import ChangeUserPassword from "../../../components/ChangePassword";
import DeactivateUserAccount from "../../../components/DeactivateAccount";
import EditProfile from "../../../components/EditProfile";
import SupportInformation from "../../../components/SuportInformation";
import { user_cookie_token } from "../../../cookies.server";
import type { Route } from "./+types/settings_page";
import { data, useActionData, useLoaderData } from "react-router";
async function getToken(request: Request) {
  const cookie = await user_cookie_token.parse(request.headers.get("Cookie"));

  if (!cookie?.token) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return cookie.token as string;
}

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ request }: Route.LoaderArgs) {
  const token = await getToken(request);

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Response("Unable to load your profile.", {
      status: response.status,
    });
  }

  const result = await response.json();
  return { user: result.data.user };
}

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }: Route.ActionArgs) {
  const token = await getToken(request);
  const form = await request.formData();
  const intent = String(form.get("intent") || "");

  let response: Response;

  if (intent === "update_profile") {
    const updates = {
      first_name: String(form.get("first_name") || "").trim(),
      last_name: String(form.get("last_name") || "").trim(),
      phone_number: String(form.get("phone_number") || "").trim(),
    };

    if (!updates.first_name || !updates.last_name) {
      return data(
        { error: "First and last names are required.", success: undefined },
        {
          status: 400,
        },
      );
    }

    response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
  } else if (intent === "change_password") {
    const old_password = String(form.get("old_password") || "");
    const new_password = String(form.get("new_password") || "");

    if (!old_password || !new_password) {
      return data(
        { error: "Both password fields are required.", success: undefined },
        { status: 400 },
      );
    }

    if (new_password.length < 8) {
      return data(
        {
          error: "Your new password must be at least 8 characters.",
          success: undefined,
        },
        { status: 400 },
      );
    }

    if (old_password === new_password) {
      return data(
        {
          error: "Your new password must differ from your current password.",
          success: undefined,
        },
        { status: 400 },
      );
    }

    response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/password_reset?source=change_password`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ old_password, new_password }),
      },
    );
  } else if (intent === "deactivate_account") {
    response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    return data(
      { error: "Invalid action.", success: undefined },
      { status: 400 },
    );
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.status) {
    return data(
      {
        error: result.error?.message || "The request failed.",
        success: undefined,
      },
      { status: response.status || 400 },
    );
  }

  return data({ success: "Profile updated successfully.", error: undefined });
}

export default function SettingsPage() {
  const { user } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();

  return (
    <main className="mx-auto max-w-3xl space-y-6">
      {result?.error && (
        <p role="alert" className="text-sm text-red-600">
          {result.error}
        </p>
      )}

      {result?.success && (
        <p role="status" className="text-sm">
          {result.success}
        </p>
      )}

      <EditProfile
        firstName={user.first_name}
        lastName={user.last_name}
        phoneNumber={user.phone_number ?? ""}
      />

      <ChangeUserPassword />
      <SupportInformation />
      <DeactivateUserAccount />
    </main>
  );
}
