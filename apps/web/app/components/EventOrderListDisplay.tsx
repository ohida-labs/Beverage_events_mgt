import { Link } from "react-router";
interface EventOrder {
  event_id: string;
  name: string;
  total: number;
  status: string;
}

export default function EventOrderListDisplay({
  events,
}: {
  events: EventOrder[];
}) {
  if (!events || !events.length) {
    return <p>You have not added any event yet!</p>;
  }

  return (
    <main className="card px-4 space-y-4 py-6 ">
      {/* Search, Filter, Sort; */}
      <article className="flex justify-between">
        {/** */}
        {/* Bug: wont filter number expect u remove the '0' */}

        {/* 
        <SearchInput
          placeholder="Search Order by id, customer name"
          className="w-80 rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        */}

        {/*
        <div>
          <div className="flex gap-2">
            <SelectActionButton
              title="Sort"
              logo={faSort}
              className="text-sm font-medium gap-x-2 
          items-center flex  text-gray-600 hover:text-black"
            >
              <li>By Name</li>
              <li>By Price</li>
              <li>By Date</li>
            </SelectActionButton>
            <SelectActionButton
              title="Filter"
              logo={faFilter}
              className="text-sm font-medium gap-x-2 
            items-center flex  text-gray-600 hover:text-black"
            >
              <li>category</li>
              <button className="bg-primary text-white border-2 rounded-full">
                Apply filter
              </button>
            </SelectActionButton>
          </div>
        </div>
    */}
      </article>

      {/*
      {orders?.length === 0 && (
        <p className="text-center font-medium text-xl">Order not found</p>
      )}
          */}

      {/**/}
      {events?.length > 0 && (
        <>
          <div className="overflow-hidden">
            <table className="w-full space-y-4 text-sm text-left">
              <thead className="border-b-secondary90 border-b-4 w-fit uppercase text-xs">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Order Id
                  </th>
                  <th className="px-6 py-3 text-nowrap">Event Name</th>
                  <th className="px-6 py-3 text-nowrap">Status</th>
                  {/* 
                  <th className="px-6 py-3 text-nowrap">Status</th>
                  <th className="px-6 py-3 text-nowrap">Date</th>
                  */}
                </tr>
              </thead>
              <tbody>
                {events &&
                  events?.length > 0 &&
                  events?.map((order) => (  
                    <tr key={order?.event_id}>
                      <td className="px-6 font-medium text-base capitalize py-4 text-gray-700">
                        <Link
                          className="border-b-primary border-dashed border-b-2"
                          to={`orders/${order?.event_id}`}
                        >
                          #{order?.event_id}
                        </Link>
                      </td>
                      <td className="px-6 capitalize py-4 text-gray-700">
                        <h3 className="font-medium">{order?.name}</h3>
                      </td>
                      <td className="px-6 capitalize py-4 text-gray-700">
                        <p className="font-medium">{order.status}</p>
                      </td>
                      <td className="px-6 py-4 capitalize">
                        <span className="rounded-full text-primary font-bold px-3 py-1">
                          Check
                        </span>
                      </td>
                      {/*
                      <td className="px-6 capitalize py-4 text-gray-700">
                        {order?.order_creation &&
                          new Date(order?.order_creation).toLocaleDateString()}
                      </td>
                          */}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/**/}
          {/*
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Total <span className="font-semibold">{total_orders}</span>
            </p>

            <article className="flex items-center gap-4">
              <SelectActionButton
                title={queryParams?.get("limit") || 30}
                logo_right={true}
                logo_style="text-black"
                logo={faChevronDown}
              >
                <li>
                  <button
                    onClick={() =>
                      setQueryParams({
                        limit: 30,
                      })
                    }
                  >
                    30
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      setQueryParams({
                        limit: 50,
                    })
                }
                  >
                    50
                    </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      setQueryParams({
                        limit: 100,
                      })
                    }
                  >
                    100
                  </button>
                </li>
              </SelectActionButton>
            <PaginateButton total_item_length={total_orders} /> 
            </article>
          </div>
          */}
        </>
      )}
    </main>
  );
}
