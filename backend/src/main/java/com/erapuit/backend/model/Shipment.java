package com.erapuit.backend.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "shipment")
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    @Column(name = "vehicle_no")
    private String vehicleNo;

    @Column(name = "date_sent")
    private OffsetDateTime dateSent;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getVehicleNo() {
        return vehicleNo;
    }

    public void setVehicleNo(String vehicleNo) {
        this.vehicleNo = vehicleNo;
    }

    public OffsetDateTime getDateSent() {
        return dateSent;
    }

    public void setDateSent(OffsetDateTime dateSent) {
        this.dateSent = dateSent;
    }
}