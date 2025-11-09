package com.erapuit.backend.repository;

import com.erapuit.backend.model.StockItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository<StockItem, Long> {
}
