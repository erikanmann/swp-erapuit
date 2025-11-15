package com.erapuit.backend.service;

public class ParsedWaybillRow {

    private Integer packageNo;
    private String woodType;
    private String assortment;
    private Double volume;
    private Integer length;
    private Integer width;
    private Integer height;
    private Boolean trailer;

    public ParsedWaybillRow() {}

    public Integer getPackageNo() {
        return packageNo;
    }

    public void setPackageNo(Integer packageNo) {
        this.packageNo = packageNo;
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

    public Double getVolume() {
        return volume;
    }

    public void setVolume(Double volume) {
        this.volume = volume;
    }

    public Integer getLength() {
        return length;
    }

    public void setLength(Integer length) {
        this.length = length;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public Boolean getTrailer() {
        return trailer;
    }

    public void setTrailer(Boolean trailer) {
        this.trailer = trailer;
    }
}
