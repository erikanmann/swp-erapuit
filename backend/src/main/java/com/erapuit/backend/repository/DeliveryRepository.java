package com.erapuit.backend.repository;

import com.erapuit.backend.dto.DeliveryListDto;
import com.erapuit.backend.model.Delivery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, UUID> {

    Optional<Delivery> findByWaybillNo(String waybillNo);

    // Pagination (for performance)
    Page<Delivery> findAll(Pageable pageable);

    // Filter deliveries by arrival date range
    List<Delivery> findByArrivalDateBetween(OffsetDateTime startDate, OffsetDateTime endDate);

    // Alternative: greater than or equal
    List<Delivery> findByArrivalDateGreaterThanEqual(OffsetDateTime startDate);

    @Query(
            "SELECT new com.erapuit.backend.dto.DeliveryListDto(" +
                    " d.id, d.supplierName, d.supplierRegCode, d.supplierAddress, " +
                    " d.driverName, d.truckNo, d.woodType, d.waybillNo, " +
                    " d.arrivalDate, d.totalVolumeTm, d.actualVolumeTm, d.deliveryStatus" +
                    ") FROM Delivery d ORDER BY d.arrivalDate DESC"
    )
    Page<DeliveryListDto> findAllSlim(Pageable pageable);

}