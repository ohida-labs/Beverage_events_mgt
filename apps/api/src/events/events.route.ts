import { Router } from "express";
import {
  CreateEventController,
  getAllEventsController,
  getEventController,
  UpdateEventController,
} from "./events.controller";

const EventRoute = Router();

EventRoute.route("/").post(CreateEventController).get(getAllEventsController);

EventRoute.route("/:event_id")
  .get(getEventController)
  .patch(UpdateEventController);

export default EventRoute;
