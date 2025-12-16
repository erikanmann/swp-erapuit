-- Allow packages without a direct product (used by multi-item packages)

ALTER TABLE app.package
    ALTER COLUMN product_id DROP NOT NULL;
