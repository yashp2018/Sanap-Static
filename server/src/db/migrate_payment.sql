-- ============================================================
--  STEP 0: Run this line first if you have a stuck transaction
-- ============================================================
ROLLBACK;

-- ============================================================
--  Payment System Migration — 25% Advance / 75% Remaining
--  Each statement runs independently (no BEGIN/COMMIT block)
-- ============================================================

-- 1. Add new columns if they don't exist yet
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_type       VARCHAR(10)   NOT NULL DEFAULT 'advance';

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS advance_percentage SMALLINT      NOT NULL DEFAULT 25;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS advance_amount     NUMERIC(12,2) NOT NULL DEFAULT 0;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS remaining_amount   NUMERIC(12,2) NOT NULL DEFAULT 0;

-- 2. Drop old payment_status constraint FIRST (before any UPDATE)
ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_payment_status_check;

-- 3. Drop payment_type constraint if exists from a previous partial run
ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_payment_type_check;

-- 4. Migrate old payment_status values to new ones
UPDATE orders SET payment_status = 'fully_paid' WHERE payment_status = 'paid';
UPDATE orders SET payment_status = 'pending'    WHERE payment_status = 'failed';

-- 5. Add new expanded payment_status constraint
ALTER TABLE orders
  ADD CONSTRAINT orders_payment_status_check
    CHECK (payment_status IN (
      'pending', 'advance_paid', 'fully_paid',
      'partially_paid', 'cancelled', 'refunded'
    ));

-- 6. Add payment_type constraint
ALTER TABLE orders
  ADD CONSTRAINT orders_payment_type_check
    CHECK (payment_type IN ('advance', 'full'));

-- 7. Back-fill advance_amount / remaining_amount for existing orders
UPDATE orders
SET
  advance_amount   = ROUND(total_amount * 0.25, 2),
  remaining_amount = ROUND(total_amount * 0.75, 2)
WHERE advance_amount = 0;

-- 8. Indexes
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_type   ON orders(payment_type);
