--COMBINE MORE TABLE
 CREATE TABLE IF NOT EXISTS event_drinks (
   event_id UUID REFERENCES events ON DELETE SET NULL,
   drink_id UUID REFERENCES guiness_drinks ON DELETE SET NULL,
   quantity INTEGER NOT NULL CHECK (quantity > 0),
   crate_size  INTEGER NOT NULL CHECK (crate_size > 0),   
   PRIMARY KEY(event_id, drink_id),
   updated_at TIMESTAMPTZ default NOW(),
   created_at TIMESTAMPTZ default NOW()
);   

DROP TRIGGER IF EXISTS trg_event_drinks_updated_at ON event_drinks;
            
CREATE TRIGGER trg_event_drinks_updated_at
BEFORE UPDATE ON event_drinks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
            