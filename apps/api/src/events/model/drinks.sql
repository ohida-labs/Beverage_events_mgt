CREATE TABLE IF NOT EXISTS guiness_drinks (
   id uuid DEFAULT gen_random_uuid(),
   name TEXT NOT NULL,
   poster_blob text,
   price INTEGER NOT NULL CHECK (price > 0),
   created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
   total_orders INTEGER DEFAULT 0,
   PRIMARY KEY(id),
   updated_at TIMESTAMPTZ default NOW(),
   created_at TIMESTAMPTZ default NOW()
);   

DROP TRIGGER IF EXISTS trg_guiness_drinks_updated_at ON guiness_drinks;
            
CREATE TRIGGER trg_guiness_drinks_updated_at
BEFORE UPDATE ON guiness_drinks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
            