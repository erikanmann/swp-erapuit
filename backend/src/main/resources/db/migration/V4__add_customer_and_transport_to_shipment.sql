-- Lisa puuduvad veerud shipment tabelisse
ALTER TABLE app.shipment
  ADD COLUMN IF NOT EXISTS customer TEXT,
  ADD COLUMN IF NOT EXISTS transport_company TEXT;

-- (valikuline) abistavad indeksid
CREATE INDEX IF NOT EXISTS ix_shipment_customer ON app.shipment(customer);
CREATE INDEX IF NOT EXISTS ix_shipment_transport_company ON app.shipment(transport_company);
