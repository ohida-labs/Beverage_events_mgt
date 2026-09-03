CREATE TABLE IF NOT EXISTS user_reset_tokens (
   token uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   email text REFERENCES users(email) ON DELETE CASCADE,
   isUsed BOOLEAN NOT NULL DEFAULT FALSE,
   expires_at TIMESTAMP NOT NULL,
   created_at TIMESTAMP default NOW()
);   
            