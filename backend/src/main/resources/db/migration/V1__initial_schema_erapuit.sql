-- ============================================================
--  Flyway Migration: V1__initial_schema_erapuit.sql
--  Purpose: Create base schema for saekaater management system
--  Source: Database Schema Design + Database Entities (GitLab)
-- ============================================================

-- === Extensions ===
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- === Schema ===
CREATE SCHEMA IF NOT EXISTS app AUTHORIZATION current_user;
SET search_path TO app, public;

-- === Enum Types ===
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'delivery_status') THEN
CREATE TYPE delivery_status AS ENUM ('received','unloaded','in_stock','rejected');
END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'log_status') THEN
CREATE TYPE log_status AS ENUM ('in_stock','processed');
END IF;
END$$;

-- ============================================================
-- 1. DELIVERY
-- ============================================================
CREATE TABLE IF NOT EXISTS delivery (
                                        id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_name   TEXT NOT NULL,
    supplier_reg_code TEXT,
    driver_name     TEXT,
    truck_no        TEXT,
    waybill_no      TEXT,
    arrival_date    TIMESTAMPTZ NOT NULL DEFAULT now(),
    total_volume_m3 NUMERIC(10,3),
    load_weight_t   NUMERIC(10,3),
    delivery_status delivery_status NOT NULL DEFAULT 'received',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
    );

CREATE INDEX IF NOT EXISTS ix_delivery_arrival_date ON delivery(arrival_date DESC);

-- ============================================================
-- 2. LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS log (
                                   id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id     UUID NOT NULL REFERENCES delivery(id) ON UPDATE CASCADE ON DELETE CASCADE,
    sawing_plan_id  UUID,
    species         TEXT,
    length_cm       INTEGER,
    diameter_mm     INTEGER,
    volume_m3       NUMERIC(10,3),
    status          log_status NOT NULL DEFAULT 'in_stock',
    barcode         TEXT UNIQUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
    );

CREATE INDEX IF NOT EXISTS ix_log_delivery ON log(delivery_id);
CREATE INDEX IF NOT EXISTS ix_log_barcode ON log(barcode);

-- ============================================================
-- 3. SAWING_PLAN
-- ============================================================
CREATE TABLE IF NOT EXISTS sawing_plan (
                                           id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT NOT NULL,
    description     TEXT,
    diameter_min    NUMERIC(10,2),
    diameter_max    NUMERIC(10,2),
    selection_type  TEXT,
    active          BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT now()
    );

-- ============================================================
-- 4. SAWING_PATTERN
-- ============================================================
CREATE TABLE IF NOT EXISTS sawing_pattern (
                                              id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sawing_plan_id  UUID NOT NULL REFERENCES sawing_plan(id) ON UPDATE CASCADE ON DELETE CASCADE,
    product_id      UUID,
    thickness_mm    NUMERIC(10,2),
    width_mm        NUMERIC(10,2),
    length_mm       NUMERIC(10,2),
    yield_ratio     NUMERIC(6,4),
    piece_count     INTEGER
    );

CREATE INDEX IF NOT EXISTS ix_sawing_pattern_plan ON sawing_pattern(sawing_plan_id);

-- ============================================================
-- 5. LOG_PROCESSING
-- ============================================================
CREATE TABLE IF NOT EXISTS log_processing (
                                              id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_id          UUID NOT NULL REFERENCES log(id) ON UPDATE CASCADE ON DELETE CASCADE,
    sawing_plan_id  UUID REFERENCES sawing_plan(id) ON UPDATE CASCADE,
    product_id      UUID,
    processed_volume NUMERIC(10,3),
    operator_name   TEXT,
    machine_name    TEXT,
    start_time      TIMESTAMPTZ,
    end_time        TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now()
    );

CREATE INDEX IF NOT EXISTS ix_log_processing_log ON log_processing(log_id);

-- ============================================================
-- 6. LOG_PRODUCT
-- ============================================================
CREATE TABLE IF NOT EXISTS log_product (
                                           id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_id          UUID NOT NULL REFERENCES log(id) ON UPDATE CASCADE ON DELETE CASCADE,
    product_id      UUID,
    count           INTEGER,
    volume_m3       NUMERIC(10,3),
    created_at      TIMESTAMPTZ DEFAULT now()
    );

CREATE INDEX IF NOT EXISTS ix_log_product_log ON log_product(log_id);

-- ============================================================
-- 7. PRODUCT
-- ============================================================
CREATE TABLE IF NOT EXISTS product (
                                       id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT NOT NULL,
    species         TEXT,
    grade           TEXT,
    thickness_mm    NUMERIC(10,2),
    width_mm        NUMERIC(10,2),
    length_mm       NUMERIC(10,2),
    price_per_m3    NUMERIC(10,2),
    created_at      TIMESTAMPTZ DEFAULT now()
    );

CREATE INDEX IF NOT EXISTS ix_product_name ON product(name);

-- ============================================================
-- 8. PACKAGE
-- ============================================================
CREATE TABLE IF NOT EXISTS package (
                                       id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id      UUID NOT NULL REFERENCES product(id) ON UPDATE CASCADE ON DELETE CASCADE,
    weight_kg       NUMERIC(10,2),
    count           INTEGER,
    volume_m3       NUMERIC(10,3),
    location        TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
    );

CREATE INDEX IF NOT EXISTS ix_package_product ON package(product_id);

-- ============================================================
-- 9. SHIPMENT
-- ============================================================
CREATE TABLE IF NOT EXISTS shipment (
                                        id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_no      TEXT,
    date_sent       TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ DEFAULT now()
    );

CREATE INDEX IF NOT EXISTS ix_shipment_date_sent ON shipment(date_sent DESC);

-- ============================================================
-- 10. SHIPMENT_ITEM
-- ============================================================
CREATE TABLE IF NOT EXISTS shipment_item (
                                             id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id     UUID NOT NULL REFERENCES shipment(id) ON UPDATE CASCADE ON DELETE CASCADE,
    package_id      UUID NOT NULL REFERENCES package(id) ON UPDATE CASCADE ON DELETE CASCADE,
    quantity        INTEGER NOT NULL DEFAULT 1
    );

CREATE INDEX IF NOT EXISTS ix_shipment_item_shipment ON shipment_item(shipment_id);

-- ============================================================
-- VIEWS (optional)
-- ============================================================
CREATE OR REPLACE VIEW v_stock_log AS
SELECT
    l.id AS log_id,
    d.waybill_no,
    l.species,
    l.length_cm,
    l.diameter_mm,
    l.volume_m3,
    CASE WHEN lp.id IS NULL THEN TRUE ELSE FALSE END AS in_stock
FROM log l
         JOIN delivery d ON d.id = l.delivery_id
         LEFT JOIN log_processing lp ON lp.log_id = l.id;

CREATE OR REPLACE VIEW v_stock_product AS
SELECT
    p.id AS package_id,
    pr.name AS product_name,
    p.volume_m3,
    p.location,
    CASE WHEN si.id IS NULL THEN TRUE ELSE FALSE END AS in_stock
FROM package p
         JOIN product pr ON pr.id = p.product_id
         LEFT JOIN shipment_item si ON si.package_id = p.id;

-- ============================================================
-- End of V1__initial_schema_erapuit.sql
-- ============================================================
