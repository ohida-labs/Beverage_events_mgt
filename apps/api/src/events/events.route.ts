import { Router } from "express";
import {
  CreateEventController,
  getAllEventsController,
  getEventController,
  UpdateEventController,
} from "./events.controller";
import { GetAllUserEventsService } from "./events.service";

const EventRoute = Router();

EventRoute.route("/")
  .post(CreateEventController) //By customer only
  .get(GetAllUserEventsService);

//By admin and customer
EventRoute.route("/:event_id")
  .get(getEventController)
  .patch(UpdateEventController);

export default EventRoute;
