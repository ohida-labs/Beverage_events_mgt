import { Response, Request, NextFunction } from "express";
import { asyncHandler } from "../utils/middleware/error";
import ValidationError from "@/utils/exceptions/validationError";
import { GetUserDetails } from "@/users/users.service";
import {
  CreateNewEventService,
  GetAllEventsService,
  GetAllUserEventsService,
  GetEventDetailService,
  GetUserEventDetailService,
  UpdateEventDetailsService,
} from "./events.service";
import AuthError from "@/utils/exceptions/AuthError";

// /events/:eventId?user_id=addsdad =GET
export const getEventController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //Actual user request
    const userId = req.userId;
    const { event_id: eventId } = req.params as {
      event_id: string;
    };

    //User_id
    const { user_id } = req.query;

    const userData = await GetUserDetails(userId);

    //For user;
    if (userData.role === "default" && userData.user_id === userId) {
      const event = await GetUserEventDetailService({ userId, eventId });
      res.json({
        status: true,
        data: event,
      });
      return;
    }

    //For an administrator;
    if (
      userData.role !== "default" &&
      user_id &&
      userData.user_id !== user_id
    ) {
      const event = await GetEventDetailService({ userId, eventId });
      res.json({
        status: true,
        data: event,
      });
      return;
    }

    next();
  },
);

// /events =GET
export const getAllEventsController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //Actual user request
    const userId = req.userId;
    const filter: IFilterEvents = req.query;
    const userData = await GetUserDetails(userId);

    //For personal users;
    if (
      userData &&
      userData.role === "default" &&
      userData.user_id === userId
    ) {
      const events = await GetAllUserEventsService({
        userId,
        filter: filter || null,
      });
      res.json({
        status: true,
        data: events,
      });
      return;
    }

    //For an administrator;
    if (userData.role !== "default" && userData) {
      const event = await GetAllEventsService({ filter: filter || null });
      res.json({
        status: true,
        data: event,
      });
      return;
    }

    next();
  },
);

// /events/:eventId?user_id=addsdad =PATCH
export const UpdateEventController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const updates: IUpdateEvent = req.body;
    const userId = req.userId;
    const { user_id } = req.query;
    const { event_id: eventId } = req.params as {
      event_id: string;
    };

    if (!updates) {
      throw new ValidationError({}, "There is nothing to update!");
    }

    //Original user
    const userData = await GetUserDetails(userId);

    //Check role: default
    if (userData.role === "default" && userData.user_id === userId) {
      const update_event = await UpdateEventDetailsService({
        userId,
        eventId,
        data: updates,
      });
      res.json({ status: true, data: update_event });
      return;
    }

    if (userData.role !== "default" && userData.user_id !== user_id) {
      const update_event = await UpdateEventDetailsService({
        userId,
        eventId,
        data: updates,
        permissions: ["state", "handle_by"],
      });
      res.json({ status: true, data: update_event });
      return;
    }
    next();
  },
);

// /events/ =POST
export const CreateEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const event_data: ICreateEvent = req.body;
    const userId = req.userId;

    if (!event_data) {
      throw new ValidationError({}, "There is nothing to create!");
    }

    //Original user
    const userData = await GetUserDetails(userId);

    //Check role: default
    if (userData.role === "default" && userData.user_id === userId) {
      const create_event = await CreateNewEventService(userId, event_data);
      res.json({ status: true, data: create_event });
    }
    if (userData.role !== "default" && userData)
      throw new AuthError(
        "Permission denied: Admin are not allow to create events!",
      );
  },
);

//Delete eevent?
export const DeleteEventController = asyncHandler(
  async (req: Request, res: Response) => {},
);
