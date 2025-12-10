SET search_path TO app, public;

DROP TABLE IF EXISTS stockitems;

CREATE TABLE stockitems (
                            id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                            delivery_id UUID NOT NULL REFERENCES app.delivery(id) ON UPDATE CASCADE ON DELETE CASCADE,
                            delivery_package_id UUID NOT NULL REFERENCES app.delivery_package(id) ON UPDATE CASCADE ON DELETE CASCADE,
                            supplier TEXT,
                            wood_type TEXT,
                            arrival_date TIMESTAMPTZ,
                            total_volume NUMERIC(10,3),
                            actual_volume_tm NUMERIC(10,3),
                            usable_volume NUMERIC(10,3),
                            location TEXT,
                            notes TEXT
);

CREATE INDEX ix_stockitems_delivery ON stockitems(delivery_id);
CREATE INDEX ix_stockitems_package ON stockitems(delivery_package_id);

ALTER TABLE app.log
    ADD COLUMN IF NOT EXISTS delivery_package_id UUID
        REFERENCES app.delivery_package(id)
            ON UPDATE CASCADE
            ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS ix_log_delivery_package ON app.log(delivery_package_id);

COMMENT ON COLUMN app.log.delivery_package_id IS
    'Viide konkreetsele pakkile millest palk pärines.';
COMMENT ON COLUMN stockitems.delivery_package_id IS
    'Viide konkreetsele delivery pakile (1 pakk = 1 stockitems rida).';

