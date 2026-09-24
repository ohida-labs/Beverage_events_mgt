import ChangeUserPassword from "../../../components/ChangePassword";
import DeactivateUserAccount from "../../../components/DeactivateAccount";
import EditProfile from "../../../components/EditProfile";
import SupportInformation from "../../../components/SuportInformation";

export default function SettingsPage() {
  return (
    <main className="space-y-6 mx-auto md:max-w-3xl">
      <EditProfile />
      <ChangeUserPassword />
      <SupportInformation />
      <DeactivateUserAccount />
    </main>
  );
}
