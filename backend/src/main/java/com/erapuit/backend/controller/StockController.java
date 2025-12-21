package com.erapuit.backend.controller;

import com.erapuit.backend.model.StockItem;
import com.erapuit.backend.model.StockUsageByWoodTypeDto;
import com.erapuit.backend.service.StockService;
import org.springframework.data.domain.Page;
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

    // NEW: Paginated stock endpoint for performance
    @GetMapping("/paged")
    public Page<StockItem> getPagedStock(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "200") int size
    ) {
        return stockService.getPagedStock(page, size);
    }

    @GetMapping("/paged-fast")
    public ResponseEntity<?> getPagedFast(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "200") int size,
            @RequestParam(required = false) String woodType,
            @RequestParam(required = false) String supplier,
            @RequestParam(required = false) String fromDate

    ) {
        return ResponseEntity.ok(stockService.getPagedFastFiltered(page, size, woodType, supplier, fromDate));
    }

    // UC2: põhidashboard – kõik laokirjed (old endpoint)
    @GetMapping
    public List<StockItem> getAllStock() {
        return stockService.getAllStock();
    }

    // UC2: filter puuliigi järgi
    @GetMapping("/by-wood-type")
    public List<StockItem> getStockByWoodType(@RequestParam String woodType) {
        return stockService.getByWoodType(woodType);
    }

    // Combined filters
    @GetMapping("/filter")
    public List<StockItem> filterStock(
            @RequestParam(required = false) String woodType,
            @RequestParam(required = false) String supplier,
            @RequestParam(required = false) String fromDate
    ) {
        return stockService.filterStock(woodType, supplier, fromDate);
    }

    // Update usable volume
    @PutMapping("/{id}/usable-volume")
    public ResponseEntity<StockItem> updateUsableVolume(
            @PathVariable Long id,
            @RequestBody StockItem updatedItem
    ) {
        StockItem updated = stockService.update(id, updatedItem);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/stats/usage-by-wood-type")
    public List<StockUsageByWoodTypeDto> getUsageStats() {
        return stockService.getUsageByWoodType();
    }
}
