BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM (
    'super_admin',
    'admin',
    'booking_manager',
    'distribution_staff',
    'consumer'
);

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT,
    country text,
    phone_number VARCHAR(20),
    profile_image_url TEXT,
    role user_role NOT NULL DEFAULT 'consumer',
    blacklisted BOOLEAN NOT NULL DEFAULT FALSE,
    blacklisted_reason TEXT, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW() 
);

CREATE TABLE beverage_items (
    drink_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    image_url TEXT,
    price_minor_units INTEGER NOT NULL CHECK (price_minor_units >= 0),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE event_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'assigned',
    'in_progress',
    'completed',
    'cancelled'
);

CREATE TABLE events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    event_name TEXT NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,
    expected_guests INTEGER NOT NULL CHECK (expected_guests > 0),
    event_poster_url TEXT,
    status event_status NOT NULL DEFAULT 'pending',
    handled_by UUID REFERENCES users(user_id)
        ON DELETE SET NULL,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE event_items (
    event_id UUID NOT NULL REFERENCES events(event_id)
        ON DELETE CASCADE,
    drink_id UUID NOT NULL REFERENCES beverage_items(drink_id)
        ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),

    -- Preserve the price quoted when the request was submitted.
    unit_price_minor_units INTEGER NOT NULL
        CHECK (unit_price_minor_units >= 0),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (event_id, drink_id)
);

-- 5. Password reset tokens
CREATE TABLE user_reset_tokens (
    token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES users(user_id)
        ON DELETE CASCADE,

    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Automatically update updated_at on modified rows.
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_beverage_items_updated_at
BEFORE UPDATE ON beverage_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_event_items_updated_at
BEFORE UPDATE ON event_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Indexes for common lookups and dashboards.
CREATE INDEX idx_events_customer_id ON events(customer_id);
CREATE INDEX idx_events_status_date ON events(status, event_date);
CREATE INDEX idx_events_handled_by ON events(handled_by);
CREATE INDEX idx_event_items_drink_id ON event_items(drink_id);
CREATE INDEX idx_reset_tokens_user_id ON user_reset_tokens(user_id);
CREATE INDEX idx_reset_tokens_expiry ON user_reset_tokens(expires_at);

COMMIT;
