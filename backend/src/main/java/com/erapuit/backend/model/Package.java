package com.erapuit.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "package")
public class Package {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "product_id")
    private UUID productId;

    @Column(name = "weight_kg")
    private BigDecimal weightKg;

    @Column(name = "count")
    private Integer count;

    @Column(name = "volume_m3")
    private BigDecimal volumeM3;

    @Column(name = "location")
    private String location;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getProductId() { return productId; }
    public void setProductId(UUID productId) { this.productId = productId; }

    public BigDecimal getWeightKg() { return weightKg; }
    public void setWeightKg(BigDecimal weightKg) { this.weightKg = weightKg; }

    public Integer getCount() { return count; }
    public void setCount(Integer count) { this.count = count; }

    public BigDecimal getVolumeM3() { return volumeM3; }
    public void setVolumeM3(BigDecimal volumeM3) { this.volumeM3 = volumeM3; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
