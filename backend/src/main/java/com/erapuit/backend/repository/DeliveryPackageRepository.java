package com.erapuit.backend.repository;

import com.erapuit.backend.model.DeliveryPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeliveryPackageRepository extends JpaRepository<DeliveryPackage, UUID> {

    List<DeliveryPackage> findByDeliveryId(UUID deliveryId);
}
