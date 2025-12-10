package com.erapuit.backend.controller;

import com.erapuit.backend.model.StockItem;
import com.erapuit.backend.model.Production;
import com.erapuit.backend.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;    // <-- PUUDUV IMPORT
import java.util.UUID;

@RestController
@RequestMapping("/api/production")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductionController {

    private final StockService stockService;

    public ProductionController(StockService stockService) {
        this.stockService = stockService;
    }

    // UC2: US 2.6 ja 2.7 – materjali kasutamine tootmises
    @PutMapping("/use-material")
    public ResponseEntity<StockItem> useMaterial(@RequestBody Production production) {
        StockItem updated = stockService.useForProductionByType(
                production.getWoodType(),
                production.getUsage()
        );
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/use-material/{deliveryPackageId}")
    public ResponseEntity<StockItem> useMaterialFromPackage(
            @PathVariable String deliveryPackageId,
            @RequestBody Map<String, Double> body
    ) {
        double usage = body.get("usage");
        StockItem updated = stockService.useForProductionByPackage(deliveryPackageId, usage);
        return ResponseEntity.ok(updated);
    }

}
