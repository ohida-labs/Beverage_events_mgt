/*
This component only shows an order that the user made 
while awaiting administrative response
*/

interface Event {
  id: string;
  name: string;
  total: number;
  drinks: {
    id: string;
    price: number;
    quantity: number;
    crate_quantity: number;
    name: string;
  }[];
}

type Props = {
  event: Event | null;
};

export default function LatestActiveOrder({ event }: Props) {
  if (!event) {
    return <p>No active order.</p>;
  }

  return (
    <div className="card rounded space-y-4 w-full">
      <div>
        <h2 className="text-xl font-bold">Active Order</h2>
        <p className="text-muted text-xs">Your last order status.</p>
      </div>

      <article className="space-y-6">
        <div>
          <p>Detail</p>
          <p>
            #{event?.id} - {event?.name}
          </p>

          <p>Total cost</p>
          <p>NGN{event?.total}</p>
        </div>

        <div>
          <p>Drinks you picked</p>
          <ul className="flex">
            {event?.drinks &&
              event?.drinks.map((d) => (
                <li key={d.id} className="flex gap-x-4 flex-wrap">
                  <div>
                    <p className="text-[1.1rem]">{d.name}</p>
                    <p className="text-[0.75rem]">NGN{d.price}</p>
                  </div>
                  <div>
                    <p>x{d.crate_quantity}</p>
                    <p>{d.quantity}</p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </article>
    </div>
  );
}
