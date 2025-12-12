package com.erapuit.backend.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "package_item")
public class PackageItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "package_id", nullable = false)
    private UUID packageId;

    @Column(name = "production_output_id", nullable = false)
    private UUID productionOutputId;

    @Column(nullable = false)
    private Integer count;

    // getters & setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getPackageId() {
        return packageId;
    }

    public void setPackageId(UUID packageId) {
        this.packageId = packageId;
    }

    public UUID getProductionOutputId() {
        return productionOutputId;
    }

    public void setProductionOutputId(UUID productionOutputId) {
        this.productionOutputId = productionOutputId;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}
