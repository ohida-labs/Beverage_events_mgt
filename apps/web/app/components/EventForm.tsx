import { useState } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import AvailableDrinksList from "./AvailableDrinksList";
import ParamsButtonForm from "./ParamsButtonForm";

export type Drink = {
  drink_id: string;
  name: string;
  image_url: string | null;
  price_minor_units: number;
  is_available: boolean;
};

type EventFormProps = {
  drinks: Drink[];
};

export default function EventForm({ drinks }: EventFormProps) {
  const actionData = useActionData();
  const navigation = useNavigation();

  const [selectedDrinks, setSelectedDrinks] = useState<Record<string, number>>(
    {},
  );
  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      {actionData?.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700"
        >
          {actionData.error}
        </div>
      )}

      <Form method="post" className="space-y-6">
        <section className="card space-y-6">
          <div>
            <label htmlFor="event_name">Event Name</label>
            <input
              id="event_name"
              name="event_name"
              placeholder="My Event"
              required
            />
          </div>

          <div>
            <label htmlFor="event_date">Event Date</label>
            <input id="event_date" name="event_date" type="date" required />
          </div>

          <div>
            <label htmlFor="expected_guests">Expected Guests</label>
            <input
              id="expected_guests"
              name="expected_guests"
              type="number"
              min={1}
              required
            />
          </div>
        </section>

        <section className="card">
          <div className="flex items-center justify-between">
            <label>Select Drinks</label>
            <ParamsButtonForm name="drinks" value="open">
              Select drinks
            </ParamsButtonForm>
          </div>

          <input
            type="hidden"
            name="items"
            value={JSON.stringify(
              Object.entries(selectedDrinks).map(([drink_id, quantity]) => ({
                drink_id,
                quantity,
              })),
            )}
          />

          <ul>
            {Object.entries(selectedDrinks).map(([drinkId, quantity]) => {
              const drink = drinks.find((item) => item.drink_id === drinkId);

              if (!drink) return null;

              return (
                <li key={drinkId}>
                  {drink.name} — Quantity: {quantity}
                </li>
              );
            })}
          </ul>
        </section>
        <button
          type="submit"
          disabled={isSubmitting}
          className="submit_button disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </Form>

      <AvailableDrinksList
        drinks={drinks}
        selectedDrinks={selectedDrinks}
        setSelectedDrinks={setSelectedDrinks}
      />
    </>
  );
}
