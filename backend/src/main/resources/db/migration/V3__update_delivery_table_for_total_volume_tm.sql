-- ============================================================
--  Flyway Migration: V3__update_delivery_table_for_total_volume_tm.sql
--  Purpose: Update delivery table for new total volume logic
-- ============================================================

SET search_path TO app, public;

-- Rename existing column total_volume_m3 → total_volume_tm
ALTER TABLE app.delivery
    RENAME COLUMN total_volume_m3 TO total_volume_tm;

--Drop unused columns if they exist (defensive style)
ALTER TABLE app.delivery
    DROP COLUMN IF EXISTS load_weight_t,
    DROP COLUMN IF EXISTS supplier_reg_code;

--Add future-ready column for actual (measured) volume (optional, currently null)
ALTER TABLE app.delivery
    ADD COLUMN IF NOT EXISTS actual_volume_tm NUMERIC(10,3);

-- Verify column constraints
ALTER TABLE app.delivery
    ALTER COLUMN total_volume_tm TYPE NUMERIC(10,3) USING total_volume_tm::NUMERIC(10,3);

COMMENT ON COLUMN app.delivery.total_volume_tm IS 'Kogukogus (tm) – sisestatakse sissetuleku registreerimisel';
COMMENT ON COLUMN app.delivery.actual_volume_tm IS 'Tegelik kogus (tm) – sisestatakse hiljem laoarvestuses';
