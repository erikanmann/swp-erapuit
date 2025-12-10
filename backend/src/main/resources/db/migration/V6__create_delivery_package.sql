-- ============================================================
--  Flyway Migration: V6__create_delivery_package.sql
--  Purpose: Create delivery-specific package table for waybill rows
-- ============================================================

SET search_path TO app, public;

CREATE TABLE IF NOT EXISTS delivery_package (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- seos veoselehe (delivery) tabeliga
    delivery_id UUID NOT NULL REFERENCES app.delivery(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

    -- pakk nr veoselehel, nt "2"
    package_no INT NOT NULL,

    -- alamindex korduvate ridade jaoks: 1,2,3...
     sub_index INT NOT NULL,

    -- lõplik pakkikood: "2-1", "2-2"
     final_code TEXT NOT NULL,

    -- sissetulevad andmed PDF-ist
    wood_type TEXT,
    assortment TEXT,
    volume_tm NUMERIC(10,3),
    length_cm INT,
    width_cm INT,
    height_cm INT,
    trailer BOOLEAN,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- kiire otsing veoselehe pakkide kaupa
CREATE INDEX IF NOT EXISTS ix_delivery_package_delivery_id
    ON delivery_package(delivery_id);

-- tagame, et sama delivery sees ei korduks final_code
CREATE UNIQUE INDEX IF NOT EXISTS ux_delivery_package_final_code
    ON delivery_package (delivery_id, final_code);



-- ============================================================
-- End
-- ============================================================