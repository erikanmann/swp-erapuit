package com.erapuit.backend.controller;

import com.erapuit.backend.model.StockItem;
import com.erapuit.backend.model.Production;
import com.erapuit.backend.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/production")
public class ProductionController {

    @Autowired
    private StockService stockService;

    @PutMapping("/use-material")
    public ResponseEntity useMaterial(@RequestBody Production production) {
        StockItem updated = stockService.useForProductionByType(production.getWoodType(), production.getUsage());
        return ResponseEntity.ok(updated);
    }
    @RestControllerAdvice
    public class GlobalExceptionHandler {
        @ExceptionHandler(RuntimeException.class)
        public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}