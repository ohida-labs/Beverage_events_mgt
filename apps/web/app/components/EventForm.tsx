/*This is the event form for creating new event and */
import { Form } from "react-router";
export default function EventForm() {
  return (
    <Form method="post" className="space-y-6">
      <section className="card space-y-6">
        <div className="space-y-3">
          <label className="block">Event Name</label>
          <input
            className="block focus:border transition duration-200 ease-out"
            name="event_name"
            placeholder="Bolaji Birthday party"
          />
        </div>

        <div>
          <label>Event Date</label>
          <input name="event_date" type="date" />
        </div>

        <div>
          <label>Expected Guests</label>
          <input type="number" name="event_guests" />
        </div>

        {/*<div>
          <label>Event Flyer</label>
          <input name="event_flyer" />
        </div>
       */}
      </section>

      {/* Load available drinks for 'create' */}
      <section className="card">
        <div>
          {/* A simple cards to select drink*/}
          <label>Drink(Name, Size, Price, Quantity)</label>
          <input name="drinks" />
        </div>
      </section>
      <button type="submit" className="submit_button">
        Save
      </button>
    </Form>
  );
}
