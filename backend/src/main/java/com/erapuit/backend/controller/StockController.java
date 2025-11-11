package com.erapuit.backend.controller;

import com.erapuit.backend.model.Delivery;
import com.erapuit.backend.model.StockItem;
import com.erapuit.backend.repository.DeliveryRepository;
import com.erapuit.backend.repository.StockRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "http://localhost:3000")
public class StockController {

    private final DeliveryRepository deliveryRepository;
    private final StockRepository stockRepository;

    public StockController(DeliveryRepository deliveryRepository, StockRepository stockRepository) {
        this.deliveryRepository = deliveryRepository;
        this.stockRepository = stockRepository;
    }

    // --- US7: kuvab kõik tarned (total + usable volume) ---
    @GetMapping
    public List<Delivery> getAllStock() {
        return deliveryRepository.findAll();
    }

    // --- US11: filtreerib puutüübi järgi
    @GetMapping("/by-wood-type")
    public List<StockItem> getStockByWoodType(@RequestParam String woodType) {
        return stockRepository.findByWoodTypeIgnoreCase(woodType);
    }

    // --- US9: uuendab usable volume (actual_volume_tm) ---
    @PutMapping("/{id}/usable-volume")
    public Delivery updateUsableVolume(@PathVariable UUID id, @RequestBody Delivery updatedDelivery) {
        return deliveryRepository.findById(id)
                .map(existing -> {
                    existing.setActualVolumeTm(updatedDelivery.getActualVolumeTm());
                    return deliveryRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
    }
}
