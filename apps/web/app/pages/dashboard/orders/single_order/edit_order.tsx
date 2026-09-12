import type { Route } from "./+types/edit_order";

//View Order Detail!
export default function EditSingleOrderPage({ params }: Route.ComponentProps) {
  const orderId = params.order_id;
  return <p> Edit this Order Page: {orderId}!</p>;
}
