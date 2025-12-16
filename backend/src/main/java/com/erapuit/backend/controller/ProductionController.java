package com.erapuit.backend.controller;

import com.erapuit.backend.dto.ProductionOutputRequest;
import com.erapuit.backend.model.StockItem;
import com.erapuit.backend.model.ProductionOutput;
import com.erapuit.backend.service.StockService;
import com.erapuit.backend.service.ProductionOutputService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/production")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductionController {

    private final StockService stockService;
    private final ProductionOutputService productionOutputService;

    public ProductionController(
            StockService stockService,
            ProductionOutputService productionOutputService
    ) {
        this.stockService = stockService;
        this.productionOutputService = productionOutputService;
    }

    // 🔹 Materjali kasutamine tootmises (laoseisu vähendamine)
    @PutMapping("/use-material/{deliveryPackageId}")
    public ResponseEntity<StockItem> useMaterialFromPackage(
            @PathVariable String deliveryPackageId,
            @RequestBody Map<String, Double> body
    ) {
        double usage = body.get("usage");
        StockItem updated =
                stockService.useForProductionByPackage(deliveryPackageId, usage);
        return ResponseEntity.ok(updated);
    }


    @PostMapping("/process/{deliveryPackageId}")
    public ProductionOutput processProduction(
            @PathVariable String deliveryPackageId,
            @RequestBody ProductionOutputRequest req
    ) {
        return productionOutputService.process(deliveryPackageId, req);
    }


}
