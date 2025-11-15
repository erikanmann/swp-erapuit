package com.erapuit.backend.controller;

import com.erapuit.backend.model.DeliveryPackage;
import com.erapuit.backend.service.DeliveryPackageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/delivery-packages")
@CrossOrigin(origins = "http://localhost:3000")
public class DeliveryPackageController {

    private final DeliveryPackageService service;

    public DeliveryPackageController(DeliveryPackageService service) {
        this.service = service;
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeliveryPackage> updatePackage(
            @PathVariable UUID id,
            @RequestBody DeliveryPackage updated
    ) {
        try {
            DeliveryPackage saved = service.updatePackage(id, updated);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
