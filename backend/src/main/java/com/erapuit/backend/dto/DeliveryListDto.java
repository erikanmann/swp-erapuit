package com.erapuit.backend.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class DeliveryListDto {

    private UUID id;
    private String supplierName;
    private String supplierRegCode;
    private String supplierAddress;
    private String driverName;
    private String truckNo;
    private String woodType;
    private String waybillNo;
    private OffsetDateTime arrivalDate;
    private BigDecimal totalVolumeTm;
    private BigDecimal actualVolumeTm;
    private com.erapuit.backend.model.DeliveryStatus deliveryStatus;

    public DeliveryListDto(
            UUID id,
            String supplierName,
            String supplierRegCode,
            String supplierAddress,
            String driverName,
            String truckNo,
            String woodType,
            String waybillNo,
            OffsetDateTime arrivalDate,
            BigDecimal totalVolumeTm,
            BigDecimal actualVolumeTm,
            com.erapuit.backend.model.DeliveryStatus deliveryStatus
    ) {
        this.id = id;
        this.supplierName = supplierName;
        this.supplierRegCode = supplierRegCode;
        this.supplierAddress = supplierAddress;
        this.driverName = driverName;
        this.truckNo = truckNo;
        this.woodType = woodType;
        this.waybillNo = waybillNo;
        this.arrivalDate = arrivalDate;
        this.totalVolumeTm = totalVolumeTm;
        this.actualVolumeTm = actualVolumeTm;
        this.deliveryStatus = deliveryStatus;
    }

    // 🔹 Getterid (vajalikud JSON jaoks)
    public UUID getId() { return id; }
    public String getSupplierName() { return supplierName; }
    public String getSupplierRegCode() { return supplierRegCode; }
    public String getSupplierAddress() { return supplierAddress; }
    public String getDriverName() { return driverName; }
    public String getTruckNo() { return truckNo; }
    public String getWoodType() { return woodType; }
    public String getWaybillNo() { return waybillNo; }
    public OffsetDateTime getArrivalDate() { return arrivalDate; }
    public BigDecimal getTotalVolumeTm() { return totalVolumeTm; }
    public BigDecimal getActualVolumeTm() { return actualVolumeTm; }
    public com.erapuit.backend.model.DeliveryStatus getDeliveryStatus() { return deliveryStatus; }
}
