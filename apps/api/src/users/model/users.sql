CREATE TYPE user_role AS ENUM (
      'default',
      'admin',
      'super_admin'
);


CREATE TABLE IF NOT EXISTS users (
   user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   email TEXT NOT NULL UNIQUE,
   password TEXT NOT NULL,
   role user_role DEFAULT 'default',
   profile TEXT,
   first_name TEXT NOT NULL,
   last_name TEXT,
   priority int default 1,
   blacklisted boolean default false,
   blacklisted_reason text,
   phone_number varchar(11),
   country text default 'nigeria',
   updated_at TIMESTAMP default NOW(),
   created_at TIMESTAMP default NOW()
);   

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
            