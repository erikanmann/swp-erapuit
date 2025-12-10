package com.erapuit.backend.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class StockListDto {

    private Long id;
    private UUID deliveryId;
    private UUID deliveryPackageId;
    private String packageCode;
    private String supplier;
    private String woodType;
    private OffsetDateTime arrivalDate;
    private BigDecimal totalVolume;
    private BigDecimal usableVolume;

    public StockListDto(
            Long id,
            UUID deliveryId,
            UUID deliveryPackageId,
            String packageCode,
            String supplier,
            String woodType,
            OffsetDateTime arrivalDate,
            BigDecimal totalVolume,
            BigDecimal usableVolume
    ) {
        this.id = id;
        this.deliveryId = deliveryId;
        this.deliveryPackageId = deliveryPackageId;
        this.packageCode = packageCode;
        this.supplier = supplier;
        this.woodType = woodType;
        this.arrivalDate = arrivalDate;
        this.totalVolume = totalVolume;
        this.usableVolume = usableVolume;
    }

    // --- Getterid JSON jaoks ---
    public Long getId() {
        return id;
    }

    public UUID getDeliveryId() {
        return deliveryId;
    }

    public UUID getDeliveryPackageId() {
        return deliveryPackageId;
    }

    public String getPackageCode() {
        return packageCode;
    }

    public String getSupplier() {
        return supplier;
    }

    public String getWoodType() {
        return woodType;
    }

    public OffsetDateTime getArrivalDate() {
        return arrivalDate;
    }

    public BigDecimal getTotalVolume() {
        return totalVolume;
    }

    public BigDecimal getUsableVolume() {
        return usableVolume;
    }
}
