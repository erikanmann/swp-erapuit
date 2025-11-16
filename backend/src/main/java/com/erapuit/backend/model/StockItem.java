package com.erapuit.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "stockitems")
public class StockItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Viide tarnele
    @Column(name = "delivery_id", nullable = false)
    private UUID deliveryId;

    // Viide konkreetsele pakile
    @Column(name = "delivery_package_id")
    private UUID deliveryPackageId;

    // Paki kood (1-1, 2-3 jne)
    @Column(name = "package_code")
    private String packageCode;

    private String supplier;

    private String woodType;

    @Column(name = "arrival_date")
    private OffsetDateTime arrivalDate;

    @Column(name = "total_volume")
    private BigDecimal totalVolume;

    @Column(name = "usable_volume")
    private BigDecimal usableVolume;

    public StockItem() {}

    // --- GETTERID JA SETTERID ---

    public Long getId() {
        return id;
    }

    public UUID getDeliveryId() {
        return deliveryId;
    }

    public void setDeliveryId(UUID deliveryId) {
        this.deliveryId = deliveryId;
    }

    public UUID getDeliveryPackageId() {
        return deliveryPackageId;
    }

    public void setDeliveryPackageId(UUID deliveryPackageId) {
        this.deliveryPackageId = deliveryPackageId;
    }

    public String getPackageCode() {
        return packageCode;
    }

    public void setPackageCode(String packageCode) {
        this.packageCode = packageCode;
    }

    public String getSupplier() {
        return supplier;
    }

    public void setSupplier(String supplier) {
        this.supplier = supplier;
    }

    public String getWoodType() {
        return woodType;
    }

    public void setWoodType(String woodType) {
        this.woodType = woodType;
    }

    public OffsetDateTime getArrivalDate() {
        return arrivalDate;
    }

    public void setArrivalDate(OffsetDateTime arrivalDate) {
        this.arrivalDate = arrivalDate;
    }

    public BigDecimal getTotalVolume() {
        return totalVolume;
    }

    public void setTotalVolume(BigDecimal totalVolume) {
        this.totalVolume = totalVolume;
    }

    public BigDecimal getUsableVolume() {
        return usableVolume;
    }

    public void setUsableVolume(BigDecimal usableVolume) {
        this.usableVolume = usableVolume;
    }
}
