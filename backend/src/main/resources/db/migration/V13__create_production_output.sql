CREATE TABLE production_output (
                                   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                                   product_id UUID NOT NULL,
                                   source_stock_item_id BIGINT NOT NULL,

                                   volume_m3 NUMERIC,
                                   count INTEGER NOT NULL,

                                   wood_type VARCHAR(50),
                                   produced_at TIMESTAMPTZ NOT NULL
);

-- indeksid UI ja päringute jaoks
CREATE INDEX idx_production_output_stock_item
    ON production_output (source_stock_item_id);

CREATE INDEX idx_production_output_product
    ON production_output (product_id);

CREATE INDEX idx_production_output_wood_type
    ON production_output (wood_type);
