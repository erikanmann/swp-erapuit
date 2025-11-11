package com.erapuit.backend.repository;

import com.erapuit.backend.model.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, UUID> {
    Optional<Delivery> findByWaybillNo(String waybillNo);

    // Filter deliveries by arrival date range
    List<Delivery> findByArrivalDateBetween(OffsetDateTime startDate, OffsetDateTime endDate);

    // Alternative: greater than or equal
    List<Delivery> findByArrivalDateGreaterThanEqual(OffsetDateTime startDate);
}
