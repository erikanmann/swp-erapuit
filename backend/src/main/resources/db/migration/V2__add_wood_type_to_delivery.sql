-- ============================================================
--  Flyway Migration: V2__add_wood_type_to_delivery.sql
--  Purpose: Add optional wood_type column to delivery table
-- ============================================================

ALTER TABLE app.delivery
    ADD COLUMN IF NOT EXISTS wood_type TEXT;
