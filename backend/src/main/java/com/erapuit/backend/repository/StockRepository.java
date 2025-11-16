package com.erapuit.backend.repository;

import com.erapuit.backend.model.StockItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StockRepository extends JpaRepository<StockItem, Long> {

    List<StockItem> findByWoodTypeIgnoreCase(String woodType);

    List<StockItem> findByDeliveryId(UUID deliveryId);

    void deleteByDeliveryId(UUID deliveryId);
}
