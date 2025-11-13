package com.erapuit.backend.model;

public class StockUsageByWoodTypeDto {

    private String woodType;
    private double totalVolume;
    private double usableVolume;
    private double usedVolume;

    public String getWoodType() {
        return woodType;
    }

    public void setWoodType(String woodType) {
        this.woodType = woodType;
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

    public double getUsedVolume() {
        return usedVolume;
    }

    public void setUsedVolume(double usedVolume) {
        this.usedVolume = usedVolume;
    }
}
