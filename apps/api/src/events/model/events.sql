CREATE TABLE IF NOT EXISTS events (
   event_id uuid DEFAULT gen_random_uuid(),
   user_id uuid REFERENCES users(user_id) ON DELETE SET NULL,
   event_name text not null,
   expected_guests INTEGER NOT NULL CHECK (expected_guests > 0),
   event_poster text,
   event_date TIMESTAMPTZ not null,
   drinks TEXT[] NOT NULL CHECK (cardinality(drinks) > 0),
   PRIMARY KEY(event_id, user_id),
   updated_at TIMESTAMPTZ default NOW(),
   created_at TIMESTAMPTZ default NOW()
);   

DROP TRIGGER IF EXISTS trg_events_updated_at ON events;
            
CREATE TRIGGER trg_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
            