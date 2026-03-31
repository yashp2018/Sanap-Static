-- ============================================================
--  Sanap Hi-Tech Nursery — Database Schema
-- ============================================================

-- ── 1. USERS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100)        NOT NULL,
  phone         VARCHAR(15)         NOT NULL UNIQUE,
  email         VARCHAR(255)        UNIQUE,
  password_hash VARCHAR(255)        NOT NULL,
  role          VARCHAR(10)         NOT NULL DEFAULT 'customer'
                  CHECK (role IN ('customer', 'admin')),
  address       TEXT,
  created_at    TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- ── 2. CATEGORIES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id         SERIAL PRIMARY KEY,
  slug       VARCHAR(50)   NOT NULL UNIQUE,  -- e.g. "vegetables"
  name       VARCHAR(100)  NOT NULL,          -- e.g. "Vegetable"
  icon       VARCHAR(10)   NOT NULL DEFAULT '🌿',
  sort_order SMALLINT      NOT NULL DEFAULT 0
);

-- ── 3. CROPS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS crops (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(50)   NOT NULL UNIQUE,  -- e.g. "tomato"
  name        VARCHAR(100)  NOT NULL,
  category_id INTEGER       NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  image_url   TEXT,
  sort_order  SMALLINT      NOT NULL DEFAULT 0
);

-- ── 4. VARIETIES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS varieties (
  id                    SERIAL PRIMARY KEY,
  slug                  VARCHAR(100)    NOT NULL UNIQUE,  -- e.g. "tom-aryaman"
  name                  VARCHAR(100)    NOT NULL,
  company               VARCHAR(100)    NOT NULL,
  crop_id               INTEGER         NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
  image_url             TEXT,
  duration_days         SMALLINT        NOT NULL DEFAULT 28,
  stock                 INTEGER         NOT NULL DEFAULT 0,
  min_order_qty         INTEGER         NOT NULL DEFAULT 1000,
  price_ex_factory      NUMERIC(8,2)    NOT NULL,
  price_15k             NUMERIC(8,2)    NOT NULL,
  price_30k             NUMERIC(8,2)    NOT NULL,
  delivery_local_charge NUMERIC(8,2)    NOT NULL DEFAULT 0,
  delivery_250km_charge NUMERIC(8,2)    NOT NULL DEFAULT 0,
  description           TEXT,
  features              TEXT[]          NOT NULL DEFAULT '{}',
  advantages            TEXT[]          NOT NULL DEFAULT '{}',
  agronomic_tips        TEXT[]          NOT NULL DEFAULT '{}',
  -- characteristics (stored as flat columns for easy querying)
  char_segment          VARCHAR(10),
  char_size             VARCHAR(30),
  char_colour           VARCHAR(30),
  char_shape            VARCHAR(30),
  char_plant_type       VARCHAR(30),
  char_avg_weight       VARCHAR(30),
  char_maturity_days    VARCHAR(20),
  char_sowing_season    VARCHAR(50),
  char_harvesting_season VARCHAR(50),
  char_vigour           VARCHAR(30),
  available_months      SMALLINT[]      NOT NULL DEFAULT '{}',  -- 0-11
  is_active             BOOLEAN         NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ── 5. CART ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  variety_id    INTEGER         NOT NULL REFERENCES varieties(id) ON DELETE CASCADE,
  quantity      INTEGER         NOT NULL CHECK (quantity > 0),
  delivery_type VARCHAR(10)     NOT NULL DEFAULT 'local'
                  CHECK (delivery_type IN ('local', '250km')),
  added_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, variety_id)   -- one row per variety per user
);

-- ── 6. ORDERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               SERIAL PRIMARY KEY,
  order_number     VARCHAR(20)     NOT NULL UNIQUE,  -- e.g. SNH-4521
  user_id          INTEGER         REFERENCES users(id) ON DELETE SET NULL,
  customer_name    VARCHAR(100)    NOT NULL,
  customer_phone   VARCHAR(15)     NOT NULL,
  customer_email   VARCHAR(255),
  delivery_address TEXT            NOT NULL,
  delivery_city    VARCHAR(100)    NOT NULL,
  delivery_state   VARCHAR(100)    NOT NULL DEFAULT 'Maharashtra',
  delivery_pincode VARCHAR(6)      NOT NULL,
  delivery_landmark VARCHAR(100),
  payment_method   VARCHAR(20)     NOT NULL
                     CHECK (payment_method IN ('razorpay', 'cod', 'bank')),
  payment_status   VARCHAR(20)     NOT NULL DEFAULT 'pending'
                     CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status     VARCHAR(20)     NOT NULL DEFAULT 'pending'
                     CHECK (order_status IN ('pending','confirmed','shipped','delivered','cancelled')),
  total_amount     NUMERIC(12,2)   NOT NULL,
  total_plants     INTEGER         NOT NULL,
  notes            TEXT,
  created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ── 7. ORDER ITEMS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id              SERIAL PRIMARY KEY,
  order_id        INTEGER         NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variety_id      INTEGER         REFERENCES varieties(id) ON DELETE SET NULL,
  variety_name    VARCHAR(100)    NOT NULL,  -- snapshot at order time
  crop_name       VARCHAR(100)    NOT NULL,
  company         VARCHAR(100)    NOT NULL,
  quantity        INTEGER         NOT NULL,
  delivery_type   VARCHAR(10)     NOT NULL,
  unit_price      NUMERIC(8,2)    NOT NULL,  -- price per plant at order time
  delivery_charge NUMERIC(10,2)   NOT NULL DEFAULT 0,
  line_total      NUMERIC(12,2)   NOT NULL
);

-- ── 8. INDEXES ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_varieties_crop     ON varieties(crop_id);
CREATE INDEX IF NOT EXISTS idx_varieties_active   ON varieties(is_active);
CREATE INDEX IF NOT EXISTS idx_cart_user          ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user        ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status      ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order  ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_crops_category     ON crops(category_id);

-- ── 9. AUTO-UPDATE updated_at on orders ──────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
