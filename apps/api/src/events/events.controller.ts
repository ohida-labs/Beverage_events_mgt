import { Response, Request, NextFunction } from "express";
import { asyncHandler } from "../utils/middleware/error";
import ValidationError from "@/utils/exceptions/validationError";
import { GetUserDetails } from "@/users/users.service";
import {
  CreateNewEventService,
  GetAllDistributionEventsService,
  GetAllEventsService,
  GetAllUserEventsService,
  GetEventDetailService,
  GetUserEventDetailService,
  UpdateDistributionEventService,
  UpdateEventDetailsService,
  UpdateManagedEventService,
} from "./events.service";
import AuthError from "@/utils/exceptions/AuthError";
import NotFoundError from "@/utils/exceptions/NotFound";

// /events/:eventId?user_id=addsdad =GET
export const getEventController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //Actual user request
    const userId = req.userId;
    const { event_id: eventId } = req.params as {
      event_id: string;
    };

    //User_id
    const { user_id } = req.query as { user_id: string };

    const userData = await GetUserDetails(userId);

    //For user;
    if (userData.role === "consumer" && userData.user_id === userId) {
      const event = await GetUserEventDetailService({ userId, eventId });
      res.json({
        status: true,
        data: { event, role: userData.role },
      });
      return;
    }

    //For an administrator;
    if (
      userData.role !== "consumer" &&
      user_id &&
      userData.user_id !== user_id
    ) {
      const event = await GetEventDetailService({
        userId,
        customer_id: user_id,
        eventId,
      });
      res.json({
        status: true,
        data: { event, role: userData.role },
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
      userData.role === "consumer" &&
      userData.user_id === userId
    ) {
      const events = await GetAllUserEventsService({
        userId,
        filter: filter || null,
      });
      res.json({
        status: true,
        data: { events, role: userData?.role },
      });
      return;
    }

    //For distributor staff only
    if (userData?.role === "distribution_staff") {
      const events = await GetAllDistributionEventsService({
        userId,
        filter: filter || null,
      });

      res.json({
        status: true,
        data: { events, role: userData.role },
      });
      return;
    }
    //For an administrator;
    if (userData.role !== "consumer" && userData) {
      const events = await GetAllEventsService({ filter: filter || null });
      res.json({
        status: true,
        data: { events, role: userData?.role },
      });
      return;
    }

    next();
  },
);

// /events/:eventId?user_id=addsdad =PATCH
/*export const UpdateEventController = asyncHandler(
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

    //Check role: consumer
    if (userData.role === "consumer" && userData.user_id === userId) {
      const update_event = await UpdateEventDetailsService({
        userId,
        eventId,
        data: updates,
      });
      res.json({ status: true, data: update_event });
      return;
    }

    if (userData.role !== "consumer" && userData.user_id !== user_id) {
      const update_event = await UpdateEventDetailsService({
        userId,
        eventId,
        data: updates,
        permissions: ["status", "handled_by"],
      });
      res.json({ status: true, data: update_event });
      return;
    }
    next();
  },
);*/

export const UpdateEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const eventId = req.params.event_id as string;
    const updates = req.body;

    if (!userId) {
      throw new AuthError("Authentication required.");
    }

    if (!eventId) {
      throw new Error("Event ID is required.");
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new Error("No updates provided.");
    }

    const user = await GetUserDetails(userId);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    let result: { event?: any; event_id?: string } = {};

    if (user.role === "consumer") {
      result = await UpdateEventDetailsService({
        userId,
        eventId,
        data: updates,
      });
    } else if (user.role === "admin" || user.role === "booking_manager") {
      result = await UpdateManagedEventService({
        eventId,
        data: updates,
      });
    } else if (user.role === "distribution_staff") {
      result = await UpdateDistributionEventService({
        userId,
        eventId,
        data: updates,
      });
    } else {
      throw new AuthError("You do not have permission to update events.");
    }

    res.status(200).json({
      status: true,
      data: result,
    });
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

    //Check role: consumer
    if (userData.role === "consumer" && userData.user_id === userId) {
      const create_event = await CreateNewEventService(userId, event_data);
      res.json({ status: true, data: create_event });
    }
    if (userData.role !== "consumer" && userData)
      throw new AuthError(
        "Permission denied: Admin are not allow to create events!",
      );
  },
);

//Delete eevent?
export const DeleteEventController = asyncHandler(
  async (req: Request, res: Response) => {},
);
