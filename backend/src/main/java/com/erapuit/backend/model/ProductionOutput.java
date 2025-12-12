package com.erapuit.backend.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "production_output")
public class ProductionOutput {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "product_id")
    private UUID productId;

    @Column(name = "source_stock_item_id")
    private Long sourceStockItemId;

    @Column(name = "volume_m3")   // ⭐ OLULINE
    private BigDecimal volumeM3;

    @Column(name = "count")
    private Integer count;

    @Column(name = "wood_type")
    private String woodType;

    @Column(name = "produced_at")
    private OffsetDateTime producedAt;

    // --- GETTERS & SETTERS ---

    public UUID getId() {
        return id;
    }

    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public Long getSourceStockItemId() {
        return sourceStockItemId;
    }

    public void setSourceStockItemId(Long sourceStockItemId) {
        this.sourceStockItemId = sourceStockItemId;
    }

    public BigDecimal getVolumeM3() {
        return volumeM3;
    }

    public void setVolumeM3(BigDecimal volumeM3) {
        this.volumeM3 = volumeM3;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public String getWoodType() {
        return woodType;
    }

    public void setWoodType(String woodType) {
        this.woodType = woodType;
    }

    public OffsetDateTime getProducedAt() {
        return producedAt;
    }

    public void setProducedAt(OffsetDateTime producedAt) {
        this.producedAt = producedAt;
    }
}
