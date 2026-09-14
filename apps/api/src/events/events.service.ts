import NotFoundError from "@/utils/exceptions/NotFound";
import {
  CreateNewEvent,
  GetAllEvents,
  GetAllEventsWithUser,
  GetEvent,
  UpdateEvent,
} from "./repository/events.repository";
import { GetUser } from "@/users/repository/users.repository";
import EventError from "@/utils/exceptions/EventError";

//get user events
export const GetUserEventDetailService = async (arg: {
  userId: string;
  eventId: string;
}) => {
  const event = await GetEvent(arg.userId, arg.eventId);

  if (!event) {
    throw new NotFoundError("Event not Found!");
  }

  return { event };
};

export const GetAllUserEventsService = async (arg: {
  userId: string;
  filter?: IFilterEvents | null;
}) => {
  const events = await GetAllEvents(arg.userId, arg.filter);
  return { events };
};

export const CreateNewEventService = async (
  userId: string,
  arg: ICreateEvent,
) => {
  const user = await GetUser(userId);

  //Check if they are blaclisted;
  if (user && user.blacklisted) {
    throw new EventError(
      user?.blacklisted_reason,
      401,
      "Permission denied: You are not permitted to create an event order.",
    );
  }

  const event = await CreateNewEvent(userId, arg);
  return event;
};

//Depends on the role;
export const UpdateEventDetailsService = async (arg: {
  userId: string;
  eventId: string;
  data: IUpdateEvent;
  permissions?: string[];
}) => {
  if (arg.permissions && arg.permissions.length > 0) {
    Object.keys(arg.data).forEach((update) => {
      if (!arg.permissions.includes(update)) {
        throw new EventError(
          "Permission denied: You are not allowed to update this event data!",
        );
      }
    });
  }

  //Check admin priority if they are allowed to accept/decline;

  //USER ARE NOT ALLOWED TO UNBLACKLIST, CHANGE ROLE
  const updated_event = await UpdateEvent(arg.userId, arg.eventId, arg.data);
  return updated_event;
};

//admin
export const GetEventDetailService = async (arg: {
  userId: string;
  eventId: string;
  // permissions: []
}) => {
  const user = await GetUser(arg.userId);

  //Check admin priortiy if they allow to view full event details
  if (user && user.role === "admin" && user.priority === 1) {
    throw new EventError(
      "You are not permitted to view this event order.",
      401,
      "Permission denied",
    );
  }

  const event = await GetEvent(arg.userId, arg.eventId);

  if (!event) {
    throw new NotFoundError("Event not Found!");
  }

  return { event };
};

export const GetAllEventsService = async (arg: {
  filter?: IFilterEvents | null;
}) => {
  //Check prioty of which admin is allow to do here!
  const events = await GetAllEventsWithUser({ filter: arg.filter });
  return { events };
};


//Add Drinks;
//Remove Drinks;
//Update Drinks
//Load Drinks;


//Later

//  export const DeleteEventService = async () => {};
//export const ExportEventsReport = async () => {};
//export const ExportEventsReportInBatch = async () => {};
