package com.erapuit.backend.repository;

import com.erapuit.backend.model.StockItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StockRepository extends JpaRepository<StockItem, Long> {
    // StockRepository.java
    @Query("SELECT s FROM StockItem s WHERE LOWER(s.woodType) = LOWER(:woodType)")
    List<StockItem> findByWoodTypeIgnoreCase(@Param("woodType") String woodType);
}
