package com.erapuit.backend.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "shipment")
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "vehicle_no")
    private String vehicleNo;

    @Column(name = "date_sent", nullable = false)
    private OffsetDateTime dateSent;

    @Column(name = "customer")
    private String customer;

    @Column(name = "transport_company")
    private String transportCompany;

    // ✅ UUS VÄLI: saatelehe number (kohustuslik)
    @Column(name = "delivery_note_no", nullable = false, unique = true)
    private String deliveryNoteNo;

    // Kui kasutad packageIds (frontendis), see pole andmebaasis vaid ajutine väli
    @Transient
    private List<UUID> packageIds;

    // --- Getters ja Setters ---
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getVehicleNo() { return vehicleNo; }
    public void setVehicleNo(String vehicleNo) { this.vehicleNo = vehicleNo; }

    public OffsetDateTime getDateSent() { return dateSent; }
    public void setDateSent(OffsetDateTime dateSent) { this.dateSent = dateSent; }

    public String getCustomer() { return customer; }
    public void setCustomer(String customer) { this.customer = customer; }

    public String getTransportCompany() { return transportCompany; }
    public void setTransportCompany(String transportCompany) { this.transportCompany = transportCompany; }

    public String getDeliveryNoteNo() { return deliveryNoteNo; }
    public void setDeliveryNoteNo(String deliveryNoteNo) { this.deliveryNoteNo = deliveryNoteNo; }

    public List<UUID> getPackageIds() { return packageIds; }
    public void setPackageIds(List<UUID> packageIds) { this.packageIds = packageIds; }
}
