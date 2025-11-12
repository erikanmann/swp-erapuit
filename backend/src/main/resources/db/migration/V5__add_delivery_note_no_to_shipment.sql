SET search_path TO app, public;

ALTER TABLE shipment
    ADD COLUMN IF NOT EXISTS delivery_note_no TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS ux_shipment_delivery_note_no
    ON shipment (delivery_note_no);
