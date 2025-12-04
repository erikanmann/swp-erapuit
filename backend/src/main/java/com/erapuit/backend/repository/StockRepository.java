package com.erapuit.backend.repository;

import com.erapuit.backend.dto.StockListDto;
import com.erapuit.backend.model.StockItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.UUID;

public interface StockRepository extends JpaRepository<StockItem, Long> {

    // Pagination support (critical for performance)
    Page<StockItem> findAll(Pageable pageable);

    List<StockItem> findByWoodTypeIgnoreCase(String woodType);

    List<StockItem> findByDeliveryId(UUID deliveryId);

    void deleteByDeliveryId(UUID deliveryId);


    @Query(
            "SELECT new com.erapuit.backend.dto.StockListDto(" +
                    " s.id, s.deliveryId, s.deliveryPackageId, s.packageCode, " +
                    " s.supplier, s.woodType, s.arrivalDate, " +
                    " s.totalVolume, s.usableVolume" +
                    ") FROM StockItem s ORDER BY s.arrivalDate DESC"
    )
    Page<StockListDto> findAllSlim(Pageable pageable);

}
