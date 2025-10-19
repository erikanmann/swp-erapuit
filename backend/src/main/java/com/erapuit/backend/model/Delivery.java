package com.erapuit.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "delivery")
public class Delivery {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "supplier_name", nullable = false)
    private String supplierName;

    @Column(name = "supplier_reg_code")
    private String supplierRegCode;

    @Column(name = "supplier_address")
    private String supplierAddress;

    @Column(name = "driver_name", nullable = false)
    private String driverName;

    @Column(name = "truck_no", nullable = false)
    private String truckNo;

    @Column(name = "waybill_no")
    private String waybillNo;

    @Column(name = "wood_type")
    private String woodType;

    @Column(name = "arrival_date")
    private LocalDate arrivalDate;

    @Column(name = "log_length_cm", precision = 10, scale = 2)
    private BigDecimal logLengthCm;

    @Column(name = "log_diameter_cm", precision = 10, scale = 2)
    private BigDecimal logDiameterCm;

    @Column(name = "total_volume_m3", precision = 10, scale = 3)
    private BigDecimal totalVolumeM3;

    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_status")
    private DeliveryStatus deliveryStatus = DeliveryStatus.RECEIVED;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    // === Konstruktorid ===
    public Delivery() {}

    // === Getterid ja Setterid ===
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getSupplierRegCode() {
        return supplierRegCode;
    }

    public void setSupplierRegCode(String supplierRegCode) {
        this.supplierRegCode = supplierRegCode;
    }

    public String getSupplierAddress() {
        return supplierAddress;
    }

    public void setSupplierAddress(String supplierAddress) {
        this.supplierAddress = supplierAddress;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getTruckNo() {
        return truckNo;
    }

    public void setTruckNo(String truckNo) {
        this.truckNo = truckNo;
    }

    public String getWaybillNo() {
        return waybillNo;
    }

    public void setWaybillNo(String waybillNo) {
        this.waybillNo = waybillNo;
    }

    public String getWoodType() {
        return woodType;
    }

    public void setWoodType(String woodType) {
        this.woodType = woodType;
    }

    public LocalDate getArrivalDate() {
        return arrivalDate;
    }

    public void setArrivalDate(LocalDate arrivalDate) {
        this.arrivalDate = arrivalDate;
    }

    public BigDecimal getLogLengthCm() {
        return logLengthCm;
    }

    public void setLogLengthCm(BigDecimal logLengthCm) {
        this.logLengthCm = logLengthCm;
    }

    public BigDecimal getLogDiameterCm() {
        return logDiameterCm;
    }

    public void setLogDiameterCm(BigDecimal logDiameterCm) {
        this.logDiameterCm = logDiameterCm;
    }

    public BigDecimal getTotalVolumeM3() {
        return totalVolumeM3;
    }

    public void setTotalVolumeM3(BigDecimal totalVolumeM3) {
        this.totalVolumeM3 = totalVolumeM3;
    }

    public DeliveryStatus getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(DeliveryStatus deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
