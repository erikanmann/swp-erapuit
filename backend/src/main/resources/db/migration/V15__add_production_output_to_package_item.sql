-- ============================================================
-- V15: Link package_item to production_output (finished goods)
-- ============================================================

SET search_path TO app, public;

ALTER TABLE package_item
    ADD COLUMN production_output_id UUID NOT NULL;

ALTER TABLE package_item
    ADD CONSTRAINT fk_package_item_production_output
        FOREIGN KEY (production_output_id)
            REFERENCES production_output (id)
            ON DELETE RESTRICT;

CREATE INDEX idx_package_item_production_output
    ON package_item (production_output_id);

-- ============================================================
-- End
-- ============================================================
