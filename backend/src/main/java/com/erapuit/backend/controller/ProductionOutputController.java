package com.erapuit.backend.controller;

import com.erapuit.backend.dto.ProductionOutputDto;
import com.erapuit.backend.service.ProductionOutputService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/production-output")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductionOutputController {

    private final ProductionOutputService service;

    public ProductionOutputController(ProductionOutputService service) {
        this.service = service;
    }

    @GetMapping("/available")
    public List<ProductionOutputDto> getAvailable() {
        return service.getAvailableOutputs();
    }
}
