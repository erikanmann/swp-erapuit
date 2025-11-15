-- ============================================================
--  Flyway Migration: V7__remove_dimensions_from_delivery_package.sql
--  Purpose: Remove length/width/height from delivery_package
-- ============================================================

SET search_path TO app, public;

ALTER TABLE delivery_package DROP COLUMN IF EXISTS length_cm;
ALTER TABLE delivery_package DROP COLUMN IF EXISTS width_cm;
ALTER TABLE delivery_package DROP COLUMN IF EXISTS height_cm;

-- ============================================================
-- End
-- ============================================================
