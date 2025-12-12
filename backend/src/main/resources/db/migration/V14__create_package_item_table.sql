-- ============================================================
-- Flyway Migration: V14__create_package_item.sql
-- Purpose: Enable packages with multiple finished products
-- ============================================================

SET search_path TO app, public;

CREATE TABLE package_item (
                              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                              package_id UUID NOT NULL,
                              product_id UUID NOT NULL,

                              count INTEGER NOT NULL CHECK (count > 0),
                              volume_m3 NUMERIC,

                              created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

                              CONSTRAINT fk_package_item_package
                                  FOREIGN KEY (package_id)
                                      REFERENCES app.package (id)
                                      ON DELETE CASCADE,

                              CONSTRAINT fk_package_item_product
                                  FOREIGN KEY (product_id)
                                      REFERENCES app.product (id)
);

-- Indeksid UI ja päringute kiirendamiseks
CREATE INDEX idx_package_item_package
    ON package_item (package_id);

CREATE INDEX idx_package_item_product
    ON package_item (product_id);

-- ============================================================
-- End
-- ============================================================
