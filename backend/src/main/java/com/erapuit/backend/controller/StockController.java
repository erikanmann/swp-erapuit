package com.erapuit.backend.controller;

import com.erapuit.backend.model.StockItem;
import com.erapuit.backend.model.StockUsageByWoodTypeDto;
import com.erapuit.backend.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "http://localhost:3000")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    // UC2: põhidashboard – kõik laokirjed
    @GetMapping
    public List<StockItem> getAllStock() {
        return stockService.getAllStock();
    }

    // UC2: filter puuliigi järgi (US 2.5)
    @GetMapping("/by-wood-type")
    public List<StockItem> getStockByWoodType(@RequestParam String woodType) {
        return stockService.getByWoodType(woodType);
    }

    // UC2: kombineeritud filter – puuliik, tarnija, kuupäev (valikulised)
    @GetMapping("/filter")
    public List<StockItem> filterStock(
            @RequestParam(required = false) String woodType,
            @RequestParam(required = false) String supplier,
            @RequestParam(required = false) String fromDate
    ) {
        return stockService.filterStock(woodType, supplier, fromDate);
    }

    // UC2: US 2.3 – muuta usableVolume
    @PutMapping("/{id}/usable-volume")
    public ResponseEntity<StockItem> updateUsableVolume(
            @PathVariable Long id,
            @RequestBody StockItem updatedItem
    ) {
        StockItem updated = stockService.update(id, updatedItem);
        return ResponseEntity.ok(updated);
    }

    // UC2: US 2.4 – statistika materjali kasutusest
    @GetMapping("/stats/usage-by-wood-type")
    public List<StockUsageByWoodTypeDto> getUsageStats() {
        return stockService.getUsageByWoodType();
    }
}
