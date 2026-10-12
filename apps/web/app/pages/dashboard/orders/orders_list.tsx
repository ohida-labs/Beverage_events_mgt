import OrderListDisplay from "../../../components/EventOrderListDisplay";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/orders_list";
import { user_cookie_token } from "../../../cookies.server";
import { GetUserEventOrders } from "../../../lib/events.server";
//import TotalPagination from "../../../components/PaginateComponent";
//import SearchInput from "../../../ui/SearchInput";
//import { SelectForm } from "../../../ui/select";

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};
  const token = cookie?.token;

  //run http request
  const events = await GetUserEventOrders(token);

  return { events };
}

//Orders list!
export default function OrdersPage() {
  const { events } = useLoaderData<typeof loader>();
  console.log(events);
  return (
    <main className="md:max-w-[80%] shadow space-y-6  p-4 md:mx-auto">
      <div>
        {/* Header and Create Button */}
        <div className="flex flex-wrap gap-y-6 card justify-between">
          <div className="px-4">
            <h2 className="text-2xl font-medium">Events</h2>
            <p className="text-muted text-xs">
              All your Event Order in one place.
            </p>
          </div>

          <button className="submit_button md:w-fit  w-full justify-center transition px-3 py-4 md:py-1 rounded-full text-[0.85rem]">
            Create new order
            {/* 
            <FontAwesomeIcon className="text-primary " icon={faInfoCircle} />
            */}
          </button>
        </div>
        {/* 
        <div className="flex mt-10 max-w-full">
          <SearchInput
            className="grow max-w-[75%]"
            placeholder="Search for Event"
          />
             <article className="flex">
            <SelectForm
              className="w-fit"
              field="td"
              onChangeValue={() => {}}
              title="Filter"
              items={[{ id: "least", name: "Least Favourite" }]}
            />
            <SelectForm
              className="w-fit"
              field="td"
              onChangeValue={() => {}}
              title="Sort"
              items={[{ id: "least", name: "Least Favourite" }]}
            />
          </article> 
        </div>
        */}
      </div>
      <OrderListDisplay events={events} />
      {/* <TotalPagination /> */}
    </main>
  );
}
