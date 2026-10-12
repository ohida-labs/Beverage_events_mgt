import { Link } from "react-router";
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
    return (
      <div className="card rounded space-y-4 w-full">
        <div>
          <h2 className="text-xl font-bold">Active Order</h2>
          <p className="text-muted text-xs">Your last order status.</p>
        </div>
        <p>No active order yet.</p>
      </div>
    );
  }

  return (
    <div className="card rounded space-y-4 w-full">
      <div>
        <h2 className="text-xl font-bold">Active Order</h2>
        <p className="text-muted text-xs">Your last order status.</p>
      </div>
      <article className="space-y-6">
        <div className="flex justify-between flex-wrap items-center space-y-1">
          <article>
            <p className="text-xl">{event?.name}</p>
            <p className="space-x-4 text-muted">
              <span>Total cost</span>
              <span>NGN{event?.total}</span>
            </p>
          </article>

          <p className="mt-4 font-600 underline text-primary70 transition hover:text-primary90 space-x-4 capitalize">
            <Link to={`/events/${event.id}`}>view details</Link>
          </p>
        </div>

        <div>
          <p className="text-xl">Event Drinks</p>
          <ul className="flex flex-col gap-y-4 mt-3">
            {event?.drinks &&
              event?.drinks.map((d) => (
                <ol
                  key={d.id}
                  className="gap-8 border-primary shadow hover:bg-primary70 hover:text-primary transition ease-in duration-150 border-2 md:max-w-md cursor-pointer rounded-2xl card bg-background w-full  list-decimal items-center flex gap-x-4 flex-wrap"
                >
                  <p className="font-bold">{d.name}</p>
                  <p className="">
                    <span className="text-xs">NGN</span>
                    {d.price}
                  </p>
                  <p>
                    <span className="text-xs">x</span>
                    {d.quantity}
                  </p>
                </ol>
              ))}
          </ul>
        </div>
      </article>
    </div>
  );
}
