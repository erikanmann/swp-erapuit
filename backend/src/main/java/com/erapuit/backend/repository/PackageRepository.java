package com.erapuit.backend.repository;

import com.erapuit.backend.model.Package;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

@Repository
public interface PackageRepository extends JpaRepository<Package, UUID> {
    List<Package> findByProductId(UUID productId);

    @Query("""
           SELECT p FROM Package p
           WHERE p.id NOT IN (
               SELECT si.packageId FROM ShipmentItem si
           )
           """)
    List<Package> findUnshippedPackages();
}