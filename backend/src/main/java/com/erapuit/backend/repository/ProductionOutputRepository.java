package com.erapuit.backend.repository;

import com.erapuit.backend.dto.ProductionOutputDto;
import com.erapuit.backend.model.ProductionOutput;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ProductionOutputRepository
        extends JpaRepository<ProductionOutput, UUID> {

    @Query("""
    select new com.erapuit.backend.dto.ProductionOutputDto(
        po.id,
        p.name,
        po.count,
        po.producedAt
    )
    from ProductionOutput po
    join Product p on p.id = po.productId
    where po.packaged = false
    order by po.producedAt desc
""")
    List<ProductionOutputDto> findAvailable();

    // --- olemasolevad jäävad alles ---
    List<ProductionOutput> findByProductId(UUID productId);
    List<ProductionOutput> findByWoodTypeIgnoreCase(String woodType);
}
