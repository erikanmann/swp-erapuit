package com.erapuit.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "stock_items")
public class StockItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String deliveryId;
    private String supplier;
    private String woodType;
    private String arrivalDate;
    private double totalVolume;
    private double usableVolume;

    public StockItem() {
    }

    public StockItem(String deliveryId, String supplier, String woodType,
                     String arrivalDate, double totalVolume, double usableVolume) {
        this.deliveryId = deliveryId;
        this.supplier = supplier;
        this.woodType = woodType;
        this.arrivalDate = arrivalDate;
        this.totalVolume = totalVolume;
        this.usableVolume = usableVolume;
    }

    public Long getId() {
        return id;
    }

    public String getDeliveryId() {
        return deliveryId;
    }

    public void setDeliveryId(String deliveryId) {
        this.deliveryId = deliveryId;
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

    public String getArrivalDate() {
        return arrivalDate;
    }

    public void setArrivalDate(String arrivalDate) {
        this.arrivalDate = arrivalDate;
    }

    public double getTotalVolume() {
        return totalVolume;
    }

    public void setTotalVolume(double totalVolume) {
        this.totalVolume = totalVolume;
    }

    public double getUsableVolume() {
        return usableVolume;
    }

    public void setUsableVolume(double usableVolume) {
        this.usableVolume = usableVolume;
    }
}
