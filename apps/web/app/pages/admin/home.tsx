const adminStats = [
  { label: "Total Events", value: "—" },
  { label: "Pending Events", value: "—" },
  { label: "Completed Events", value: "—" },
  { label: "Total Users", value: "—" },
];

const adminActions = [
  {
    title: "Manage Events",
    description: "View and track events across the platform.",
    href: "/dashboard/events",
  },
  {
    title: "Manage Users",
    description: "View accounts and manage user access.",
    href: "/admin/users",
  },
  {
    title: "Manage Beverages",
    description: "Maintain the beverage catalogue.",
    href: "/admin/beverages",
  },
];

export default function AdminHomePage() {
  return (
    <main className="space-y-12">
      <header className="border-b-2 py-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of events, users and platform management.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Overall Stat</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {adminStats.map((stat) => (
            <article key={stat.label} className="card space-y-2">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-3xl font-semibold">{stat.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Quick Links</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {adminActions.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="card block space-y-2 transition hover:shadow-md"
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
              <span className="text-sm font-medium">Open management →</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
