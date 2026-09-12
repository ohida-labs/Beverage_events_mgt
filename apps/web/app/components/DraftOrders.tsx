/*
This component only shows an order that the user made 
while awaiting administrative response
*/

interface DraftedEvent {
  id: string;
  name: string;
  total: number;
  status: string;
}

export default function DraftsOrderList({
  events,
}: {
  events: DraftedEvent[] | null;
}) {
  return (
    <div className="card rounded space-y-4 w-full">
      <div>
        <h2 className="text-xl font-bold">Drafts </h2>
        <p className="text-muted text-xs">
          Order saved to drafts. Only you can view this!
        </p>
      </div>
      <article>
        {!events && <p>No drafts here</p>}
        {events && (
          <ul>
            <li className="flex px-6 rounded-full py-4 justify-between ">
              <p className="text-muted text-[0.85rem]">Order Id</p>
              <p className="text-muted text-[0.85rem]">Event Name</p>
              <p className="text-muted text-[0.85rem]">Amt to</p>
            </li>
            {events?.map((e) => (
              <li
                key={e.id}
                className="flex hover:bg-muted animate-fade-in-scale ease-in
              px-6 rounded-full py-4 hover:text-black
              justify-between"
              >
                <p>{e.id}</p>
                <p>{e.name}</p>
                <p>NGN{e.total}</p>
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  );
}
