package com.erapuit.backend.dto;

public class ProductionUsageRequest {
    private String woodType;
    private double usage;

    public String getWoodType() { return woodType; }
    public void setWoodType(String woodType) { this.woodType = woodType; }
    public double getUsage() { return usage; }
    public void setUsage(double usage) { this.usage = usage; }
}
