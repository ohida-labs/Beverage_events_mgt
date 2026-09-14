//Create Order Detail!

import EventForm from "../../../../components/EventForm";
import type { Route } from "./+types/create_order";
import { redirect } from "react-router";
// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }: Route.ActionArgs) {
  //Create new Event
  //const formData = await request.formData();

  //const customerName = formData.get("customer_name");
  // const quantity = formData.get("quantity");

  //Make http request here!
  console.log(request.method);
  return redirect(`/orders/12112`);
}

export default function CreateNewEventOrderPage() {
  return (
    <main className="md:max-w-3xl space-y-4 mx-auto">
      <h3 className="text-h font-medium text-2xl text-center">
        Create a new Event
      </h3>
      <EventForm />
    </main>
  );
}
