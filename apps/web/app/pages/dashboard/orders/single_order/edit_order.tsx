//Create Order Detail!
import EventForm from "../../../../components/EventForm";
import type { Route } from "./+types/edit_order";

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }: Route.ActionArgs) {
  //Edit new Event
  const body = await request.formData();
  const name = body.get("visitorsName");

  return { message: `Hello, ${name}` };
}

export default function EditEventOrderPage() {
  return (
    <main className="md:max-w-3xl space-y-4 mx-auto">
      <h3 className="text-h font-medium text-2xl text-center">
        Edit Event Page
      </h3>
      <EventForm />
    </main>
  );
}
