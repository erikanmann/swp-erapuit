package com.erapuit.backend.service;

import com.erapuit.backend.model.StockItem;
import com.erapuit.backend.repository.StockRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StockService {
    private final StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    public List<StockItem> getAllStock() {
        return stockRepository.findAll();
    }

    public StockItem save(StockItem item) {
        return stockRepository.save(item);
    }

    public StockItem update(Long id, StockItem updated) {
        StockItem existing = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock item not found"));
        existing.setUsableVolume(updated.getUsableVolume());
        return stockRepository.save(existing);
    }
    // --- US12
    public StockItem useForProductionByType(String woodType, double usage) {
        List<StockItem> items = stockRepository.findByWoodTypeIgnoreCase(woodType);
        if (items.isEmpty()) {
            System.out.println("ERROR: Material not found: " + woodType);
            throw new RuntimeException("Material not found: " + woodType);
        }
        StockItem item = items.get(0);
        if (item.getUsableVolume() < usage) {
            System.out.println("ERROR: Not enough stock for " + woodType + " (laos: " + item.getUsableVolume() + ", soovitud: " + usage + ")");
            throw new RuntimeException("Not enough stock! (laos: " + item.getUsableVolume() + ")");
        }
        item.setUsableVolume(item.getUsableVolume() - usage);
        return stockRepository.save(item);
    }

}
