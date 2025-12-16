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

    @Query("""
           SELECT p FROM Package p
           WHERE NOT EXISTS (
               SELECT 1 FROM ShipmentItem si
               WHERE si.packageId = p.id
                 AND si.shipmentId <> :shipmentId
           )
           """)
    List<Package> findUnshippedOrBelongingTo(UUID shipmentId);
}
