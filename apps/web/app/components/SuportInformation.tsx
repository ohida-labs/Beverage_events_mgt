const SUPPORT_PHONE = ""; // Add the verified support number.

export default function SupportInformation() {
  return (
    <section className="card space-y-3">
      <h2 className="text-lg font-semibold">Support</h2>
      <p className="text-sm text-gray-500">
        Need help with your account or a booking? Contact your Guinness
        administrator.
      </p>

      {SUPPORT_PHONE ? (
        <a href={`tel:${SUPPORT_PHONE}`} className="inline-block">
          Call support
        </a>
      ) : (
        <p className="text-sm">
          Contact details will be provided by your administrator.
        </p>
      )}
    </section>
  );
}
