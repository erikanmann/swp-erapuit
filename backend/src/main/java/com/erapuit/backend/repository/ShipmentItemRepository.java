package com.erapuit.backend.repository;

import com.erapuit.backend.model.ShipmentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ShipmentItemRepository extends JpaRepository<ShipmentItem, Integer> {
    List<ShipmentItem> findByPackageId(UUID packageId);
    List<ShipmentItem> findByShipmentId(UUID shipmentId);
}
