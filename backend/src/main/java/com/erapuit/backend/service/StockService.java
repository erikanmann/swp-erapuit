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
}
