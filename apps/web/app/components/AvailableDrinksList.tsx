import { useSearchParams } from "react-router";
import { useState } from "react";
type Drink = {
  drink_id: string;
  name: string;
  logo: string;
  crate_size: number;
  unit_price: number;
};

type SelectedDrink = {
  drink_id: string;
  quantity: number;
};

type AvailableDrinkComponentProps = {
  drinks?: Drink[];
};

export default function AvailableDrinksList({
  drinks,
}: AvailableDrinkComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const isOpen = searchParams.get("drinks") === "open";

  const [selectedDrinks, setSelectedDrinks] = useState<Record<string, number>>(
    {},
  );

  const [pendingQuantities, setPendingQuantities] = useState<
    Record<string, number>
  >({});

  const closeModal = () => {
    setSearchParams((params) => {
      params.delete("drinks");
      return params;
    });
  };

  console.log(pendingQuantities);
  console.log(selectedDrinks);

  const toggleDrink = (drinkId: string, checked: boolean) => {
    if (!checked) {
      setSelectedDrinks((current) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [drinkId]: _, ...rest } = current;
        return rest;
      });

      setPendingQuantities((current) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [drinkId]: _, ...rest } = current;
        return rest;
      });

      return;
    }

    setPendingQuantities((current) => ({
      ...current,
      [drinkId]: current[drinkId] ?? 1,
    }));
  };

  const setPendingQuantity = (drinkId: string, quantity: number) => {
    setPendingQuantities((current) => ({
      ...current,
      [drinkId]: quantity,
    }));
  };

  /*  const confirmQuantity = (drinkId: string) => {
    const quantity = pendingQuantities[drinkId];

    if (!quantity || quantity < 1) return;

    setSelectedDrinks((current) => ({
      ...current,
      [drinkId]: quantity,
    }));
  };
*/
  const handleSave = () => {
    const selected: SelectedDrink[] = Object.entries(selectedDrinks).map(
      ([drink_id, quantity]) => ({
        drink_id,
        quantity,
      }),
    );

    console.log(selected);

    // Later:
    // pass this data back to the event form
    // or update your form state.

    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6">
      <div
        className="flex h-[90vh] w-full max-w-2xl flex-col overflow-hidden 
      rounded-t-2xl 
      card shadow-xl sm:h-[85vh] sm:rounded-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold">Available Drinks</h2>

            <p className="mt-0.5 text-sm text-muted">
              Select the drinks you need for this event.
            </p>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="rounded-full p-2 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Drinks */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-3">
            {drinks &&
              drinks.map((drink) => {
                const selected = selectedDrinks[drink.drink_id];

                return (
                  <label
                    key={drink.drink_id}
                    className="group block
                     cursor-pointer rounded-xl bg-input p-4 transition hover:text-primary"
                  >
                    <div className="flex items-center gap-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        // checked={drink.drink_id in pendingQuantities}
                        onChange={(event) =>
                          toggleDrink(
                            drink.drink_id,
                            event.currentTarget.checked,
                          )
                        }
                      />

                      <div
                        className="
                        flex h-5 w-5 shrink-0 items-center justify-center
                        rounded-md border border-border
                        transitionpeer-checked:border-black
                        peer-checked:bg-black
                      "
                      ></div>

                      {/* Logo */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={drink.logo}
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      </div>

                      {/* Drink information */}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{drink.name}</p>

                        <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted">
                          <span>{drink.crate_size} units / crate</span>

                          <span>
                            ₦{drink.unit_price.toLocaleString()} / unit
                          </span>
                        </div>
                      </div>

                      {/* Selected quantity */}
                      {selected && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                          x {selected}
                        </span>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div
                      className="mt-3  
                    items-center gap-2 pl-9 
                    peer-checked:flex"
                    >
                      <input
                        type="number"
                        min={1}
                        value={pendingQuantities[drink.drink_id] ?? 1}
                        onChange={(event) =>
                          setPendingQuantity(
                            drink.drink_id,
                            Number(event.target.value),
                          )
                        }
                        onClick={(event) => event.stopPropagation()}
                        className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                        placeholder="Quantity"
                      />

                      {/* <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          confirmQuantity(drink.drink_id);
                        }}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                      >
                        OK
                      </button>*/}
                    </div>
                  </label>
                );
              })}
          </div>
        </div>

        {/* Sticky footer */}
        <div className="shrink-0  px-5 py-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
