package com.erapuit.backend.dto;

public class IncomingWaybillDto {

    private String waybillNumber;
    private String truckNo;
    private String trailerNo;
    private String driverName;
    private String driverPhone;

    private String woodOwnerName;
    private String receiverName;
    private String placeOfDeliveryName;

    private String status;
    private String departureTime;
    private Double mass;

    public String getWaybillNumber() { return waybillNumber; }
    public void setWaybillNumber(String waybillNumber) { this.waybillNumber = waybillNumber; }

    public String getTruckNo() { return truckNo; }
    public void setTruckNo(String truckNo) { this.truckNo = truckNo; }

    public String getTrailerNo() { return trailerNo; }
    public void setTrailerNo(String trailerNo) { this.trailerNo = trailerNo; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public String getDriverPhone() { return driverPhone; }
    public void setDriverPhone(String driverPhone) { this.driverPhone = driverPhone; }

    public String getWoodOwnerName() { return woodOwnerName; }
    public void setWoodOwnerName(String woodOwnerName) { this.woodOwnerName = woodOwnerName; }

    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

    public String getPlaceOfDeliveryName() { return placeOfDeliveryName; }
    public void setPlaceOfDeliveryName(String placeOfDeliveryName) { this.placeOfDeliveryName = placeOfDeliveryName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public Double getMass() { return mass; }
    public void setMass(Double mass) { this.mass = mass; }
}
