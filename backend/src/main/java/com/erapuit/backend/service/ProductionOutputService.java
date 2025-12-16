package com.erapuit.backend.service;

import com.erapuit.backend.dto.ProductionOutputDto;
import com.erapuit.backend.dto.ProductionOutputRequest;
import com.erapuit.backend.model.ProductionOutput;
import com.erapuit.backend.model.StockItem;
import com.erapuit.backend.repository.ProductionOutputRepository;
import com.erapuit.backend.repository.StockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;



@Service
public class ProductionOutputService {

    private final ProductionOutputRepository repo;
    private final StockRepository stockRepository;

    public ProductionOutputService(
            ProductionOutputRepository repo,
            StockRepository stockRepository
    ) {
        this.repo = repo;
        this.stockRepository = stockRepository;
    }
    @Transactional
    public ProductionOutput process(String deliveryPackageId, ProductionOutputRequest req) {

        StockItem stock = stockRepository
                .findByDeliveryPackageId(UUID.fromString(deliveryPackageId))
                .orElseThrow(() -> new IllegalArgumentException("StockItem not found"));


        if (stock.getUsableVolume().compareTo(req.volumeM3()) < 0) {
            throw new IllegalArgumentException("Not enough usable volume");
        }

        // 1. vähenda laoseisu
        stock.setUsableVolume(
                stock.getUsableVolume().subtract(req.volumeM3())
        );
        stockRepository.save(stock);

        // 2. loo tootmise väljund
        ProductionOutput out = new ProductionOutput();
        out.setProductId(req.productId());
        out.setSourceStockItemId(stock.getId());
        out.setWoodType(stock.getWoodType());
        out.setCount(req.count());
        out.setVolumeM3(req.volumeM3());
        out.setProducedAt(OffsetDateTime.now());

        return repo.save(out);
    }
    public List<ProductionOutputDto> getAvailableOutputs() {
        return repo.findAvailable();
    }





}
