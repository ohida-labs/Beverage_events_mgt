/*This is the event form for creating new event and */
import { Form } from "react-router";
import AvailableDrinksList from "./AvailableDrinksList";
import ParamsButtonForm from "./ParamsButtonForm";
export default function EventForm() {
  //set params
  /*  const [searchParams, setSearchParams] = useSearchParams<>();
  const isOpened = searchParams.get("show_available_drink") || null;

const OpenDrinksPortal = () =>{
  alert('dsa')
  setSearchParams({ show_available_drink: 1 });
};

const CloseDrinksPortal = () =>{
  setSearchParams();
};*/

  const drinks = [
    {
      drink_id: "drink1",
      name: "Malta Guiness 1.5l 24pieces",
      logo: "/favicon.ico",
      crate_size: 24,
      unit_price: 5600,
    },
    {
      drink_id: "drink2",
      name: "Malta Guiness 1.5l 24pieces",
      logo: "/favicon.ico",
      crate_size: 24,
      unit_price: 5600,
    },
    {
      drink_id: "drink3",
      name: "Guiness 1.4l 12pieces",
      logo: "/favicon.ico",
      crate_size: 24,
      unit_price: 5600,
    },
    {
      drink_id: "drink4",
      name: "Gordons 1.5l 4pieces",
      logo: "/favicon.ico",
      crate_size: 24,
      unit_price: 5600,
    },
  ];
  return (
    <>
      <Form className="space-y-6">
        <section className="card space-y-6">
          <div className="group space-y-3">
            <label className="block ">Event Name</label>
            <input
              className="block
            focus:border transition duration-200 ease-out"
              name="event_name"
              placeholder="Bolaji Birthday party"
              required
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
          <div className="flex items-center justify-between">
            {/* A simple cards to select drink*/}
            <label>Select Drinks</label>
            <ParamsButtonForm name="drinks" value="open">
              <span className="font-semibold">+</span>
              <span>Pick</span>
            </ParamsButtonForm>
          </div>
        </section>

        {/* selected drink */}
        <section></section>
        <button type="submit" className="submit_button">
          Save
        </button>
      </Form>

      {/* drinks card */}

      <AvailableDrinksList drinks={drinks} />
    </>
  );
}
