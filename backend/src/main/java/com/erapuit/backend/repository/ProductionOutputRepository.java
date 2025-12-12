package com.erapuit.backend.repository;

import com.erapuit.backend.model.ProductionOutput;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductionOutputRepository
        extends JpaRepository<ProductionOutput, UUID> {

    // Kõik tootmise väljundid ühe laokirje (palgi) kohta
    List<ProductionOutput> findBySourceStockItemId(Long sourceStockItemId);

    // Kõik tootmise väljundid ühe toote kohta
    List<ProductionOutput> findByProductId(UUID productId);

    // UI filtriks (nt ainult kuusk)
    List<ProductionOutput> findByWoodTypeIgnoreCase(String woodType);
    List<ProductionOutput> findAll();
}
