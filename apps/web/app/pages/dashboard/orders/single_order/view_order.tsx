import type { Route } from "./+types/view_order";

//View Order Detail!
export default function ViewSingleOrderPage({ params }: Route.ComponentProps) {
  const orderId = params.order_id;
  return <p> Order Page: {orderId}!</p>;
}
