interface IEvent {
  event_id: string;
  user_id: string;
  event_name: string;
  expected_guests: number;
  event_poster?: string;
  event_date: Date;
  drinks: string[];
  created_at: Date;
}

interface IUpdateEvent {
  event_name?: string;
  expected_guests?: number;
  event_poster?: string;
  state?: "drafts" | "pending" | "processing" | "completed" | "cancelled";
  handled_by?: string;
  event_date?: Date;
  drinks?: string[];
}

interface ICreateEvent {
  event_name: string;
  expected_guests: string;
  event_date: string;
  drinks: string[];
}

interface IFilterEvents {
  page?: number;
  limit?: number;
  search?: string;

  sortBy?: "expected_guests" | "state" | "event_date" | "created_at" | null;
  sortOrder?: "asc" | "desc" | null;
  user?: string;
  status?: "drafts" | "pending" | "processing" | "cancelled" | "completed";
}
