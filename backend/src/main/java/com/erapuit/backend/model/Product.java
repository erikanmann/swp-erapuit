package com.erapuit.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String species;

    @Column(name = "assortment")
    private String assortment;

    // Mõõtmed BigDecimal -> sobivad NUMERIC veeruga PostgreSQL-is
    @Column(name = "thickness_mm")
    private BigDecimal thicknessMm;

    @Column(name = "width_mm")
    private BigDecimal widthMm;

    @Column(name = "length_mm")
    private BigDecimal lengthMm;

    @Column(name = "default_piece_count")
    private Integer defaultPieceCount;

    @Column(name = "price_per_m3")
    private BigDecimal pricePerM3;


    // ---- GETTERS & SETTERS ----

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getAssortment() {
        return assortment;
    }

    public void setAssortment(String assortment) {
        this.assortment = assortment;
    }

    public BigDecimal getThicknessMm() {
        return thicknessMm;
    }

    public void setThicknessMm(BigDecimal thicknessMm) {
        this.thicknessMm = thicknessMm;
    }

    public BigDecimal getWidthMm() {
        return widthMm;
    }

    public void setWidthMm(BigDecimal widthMm) {
        this.widthMm = widthMm;
    }

    public BigDecimal getLengthMm() {
        return lengthMm;
    }

    public void setLengthMm(BigDecimal lengthMm) {
        this.lengthMm = lengthMm;
    }

    public Integer getDefaultPieceCount() {
        return defaultPieceCount;
    }

    public void setDefaultPieceCount(Integer defaultPieceCount) {
        this.defaultPieceCount = defaultPieceCount;
    }

    public BigDecimal getPricePerM3() {
        return pricePerM3;
    }

    public void setPricePerM3(BigDecimal pricePerM3) {
        this.pricePerM3 = pricePerM3;
    }

    // ---- MAHU ARVUTAMINE (1 tk m³) ----
    public BigDecimal calculateUnitVolumeM3() {

        if (thicknessMm == null || widthMm == null || lengthMm == null) {
            return BigDecimal.ZERO;
        }

        // paksus * laius * pikkus (mm³) → m³
        return thicknessMm
                .multiply(widthMm)
                .multiply(lengthMm)
                .divide(BigDecimal.valueOf(1_000_000_000L));
    }
}
