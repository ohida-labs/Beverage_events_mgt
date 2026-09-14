interface EventOrder {
  event_id: string;
  name: string;
  total: number;
  status: string;
}

export default function SingleEventOrder({ event }: { event: EventOrder }) {
  return (
    <main className="mx-auto w-full max-w-xl space-y-4">
      <section className="flex justify-between">
        <article>
          <h2 className="text-xl font-semibold">#{event?.event_id}</h2>

          {/*<p className="text-desc text-muted">
            {`${new Date(order?.created_at).toLocaleDateString()} ${new Date(order?.created_at).toLocaleTimeString()}`}
          </p>*/}
        </article>

        <article className="flex items-center gap-3">
          {/* 
          <SelectActionButton
            tag="order_action_list"
            title={"more"}
            className="flex text-xl items-center space-x-2 h-fit bg-gray-300 cursor-pointer rounded-2xl outline-none"
          >
            <button>View Public</button>
            <button>Share</button>
          </SelectActionButton>
          */}
          {/* 
          <button
            onClick={deleteOrderAction}
            disabled={state?.loading === "delete"}
            className="text-danger 
            px-2 space-x-2 bg-danger/40 cursor-pointer rounded"
          >
            {state?.loading === "delete" ? (
              <FontAwesomeIcon icon={faSpinner} />
            ) : (
              <>
                <FontAwesomeIcon icon={faTrash} />
                <span>Delete</span>
              </>
            )}
          </button>{" "}
        */}
        </article>
      </section>

      <section className="space-y-4">
        <div className="card p-0 space-y-4">
          {/*<ErrorText>{state?.error}</ErrorText>*/}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Order Status</h2>
            <p className="capitalize">{event.status}</p>
            {/* <SelectForm
              onChangeValue={handleSelectChanges}
              field="status"
              title={order?.status?.toUpperCase()}
              className="w-fit"
              items={[
                { name: "Pending", id: "pending" },
                { name: "Processing", id: "processing" },
                { name: "Cancelled", id: "cancelled" },
                { name: "On delivery", id: "on delivery" },
                { name: "Completed", id: "completed" },
              ]}
            /> 
              */}
          </div>
        </div>
        {/* Drinkd List */}
        <div className="border-b-border py-4 border-b">
          {/*<ul className="space-y-4">
              {order?.cart_items?.map((item) => (
                <li
                  key={item.product_id}
                  className="flex items-center justify-between"
                >
                  <article>
                    <div className="">
                      {item?.images && (
                        <Image
                          className="w-auto h-auto"
                          src={item?.images[0]}
                          height={20}
                          width={40}
                          alt={item.name}
                        />
                      )}
                      <h3 className="text-base font-semibold">{item?.name}</h3>
                    </div>
                  </article>
                  <div>
                    <p className="font-semibold">NGN{item?.total}</p>
                    <p className="text-desc text-muted">
                      <span>NGN{item?.price}</span> x <span>{item?.qty}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>*/}
        </div>

        {/* Item List Total */}
        <div className="flex justify-between">
          <p>Total</p>
          <p className="font-semibold">NGN{event?.total}</p>
        </div>

        {/*
        <Card className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Customer</h2>
            <button className="bg-input px-4 py-1 text-white rounded">
              <Link href={`/admin/customers/${order?.customer_id}`}>
                <FontAwesomeIcon icon={faChevronRight} />
              </Link>
            </button>
          </div>

          <div className="flex justify-between">
            <p className="text-based font-semibold">Name</p>
            <p className="text-desc text-muted">{order?.customer_name}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-based font-semibold">Phone</p>
            <p className="text-desc text-muted">0{order?.customer_phone}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-based font-semibold">Member since</p>
            <p className="text-desc text-muted">
              {`${new Date(order?.member_since).toLocaleDateString()}`}
            </p>
          </div>
        </Card>
        */}
      </section>
    </main>
  );
}
