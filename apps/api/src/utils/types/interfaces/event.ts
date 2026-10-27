export interface IEvent {
  event_id: string;
  user_id: string;
  event_name: string;
  expected_guests: number;
  event_poster?: string;
  event_date: Date;
  drinks: string[];
  created_at: Date;
}
/*
export interface IUpdateEvent {
  event_name?: string;
  expected_guests?: number;
  event_poster?: string;
  state?: "drafts" | "pending" | "processing" | "completed" | "cancelled";
  handled_by?: string;
  event_date?: Date;
  drinks?: string[];
}*/

export interface IUpdateEvent {
  event_name?: string;
  expected_guests?: number;
  event_poster_url?: string | null;
  status?:
    | "pending"
    | "approved"
    | "rejected"
    | "assigned"
    | "in_progress"
    | "completed"
    | "cancelled";
  handled_by?: string | null;
  rejection_reason?: string | null;
  event_date?: Date;
}

export interface IManagedEventUpdate {
  status?:
    | "approved"
    | "rejected"
    | "assigned"
    | "in_progress"
    | "completed"
    | "cancelled";
  handled_by?: string | null;
  rejection_reason?: string | null;
}

export interface ICreateEvent {
  event_name: string;
  expected_guests: number;
  event_date: string;
  items: {
    drink_id: string;
    quantity: number;
  }[];
}

export interface IFilterEvents {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "expected_guests" | "state" | "event_date" | "created_at" | null;
  sortOrder?: "asc" | "desc" | null;
  user?: string;
  status?:
    "drafts" | "pending" | "processing" | "cancelled" | "completed" | null;
}
