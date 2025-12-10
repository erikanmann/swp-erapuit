package com.erapuit.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "delivery_package", schema = "app")
public class DeliveryPackage {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "delivery_id", nullable = false)
    private UUID deliveryId;

    @Column(name = "package_no", nullable = false)
    private Integer packageNo;

    @Column(name = "sub_index", nullable = false)
    private Integer subIndex;

    @Column(name = "final_code", nullable = false)
    private String finalCode;

    @Column(name = "wood_type")
    private String woodType;

    @Column(name = "assortment")
    private String assortment;

    @Column(name = "volume_tm", precision = 10, scale = 3)
    private BigDecimal volumeTm;

    @Column(name = "trailer")
    private Boolean trailer;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public DeliveryPackage() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getDeliveryId() {
        return deliveryId;
    }

    public void setDeliveryId(UUID deliveryId) {
        this.deliveryId = deliveryId;
    }

    public Integer getPackageNo() {
        return packageNo;
    }

    public void setPackageNo(Integer packageNo) {
        this.packageNo = packageNo;
    }

    public Integer getSubIndex() {
        return subIndex;
    }

    public void setSubIndex(Integer subIndex) {
        this.subIndex = subIndex;
    }

    public String getFinalCode() {
        return finalCode;
    }

    public void setFinalCode(String finalCode) {
        this.finalCode = finalCode;
    }

    public String getWoodType() {
        return woodType;
    }

    public void setWoodType(String woodType) {
        this.woodType = woodType;
    }

    public String getAssortment() {
        return assortment;
    }

    public void setAssortment(String assortment) {
        this.assortment = assortment;
    }

    public BigDecimal getVolumeTm() { return volumeTm; }

    public void setVolumeTm(BigDecimal volumeTm) { this.volumeTm = volumeTm; }

    public Boolean getTrailer() {
        return trailer;
    }

    public void setTrailer(Boolean trailer) {
        this.trailer = trailer;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
