package com.erapuit.backend.controller;

import com.erapuit.backend.model.DeliveryPackage;
import com.erapuit.backend.service.DeliveryPackageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/delivery-packages")
@CrossOrigin(origins = "http://localhost:3000")
public class DeliveryPackageController {

    private final DeliveryPackageService service;

    public DeliveryPackageController(DeliveryPackageService service) {
        this.service = service;
    }

    // -------------------------------------------
    // GET üksik pakk: /api/delivery-packages/{id}
    // -------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<DeliveryPackage> getPackage(@PathVariable UUID id) {
        try {
            DeliveryPackage pkg = service.getOnePackage(id);
            return ResponseEntity.ok(pkg);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    // ---------------------------------------------------------------
    // GET kõik tarne pakid: /api/delivery-packages/delivery/{deliveryId}
    // ---------------------------------------------------------------
    @GetMapping("/delivery/{deliveryId}")
    public ResponseEntity<List<DeliveryPackage>> getPackagesForDelivery(
            @PathVariable UUID deliveryId
    ) {
        List<DeliveryPackage> rows = service.getPackagesForDelivery(deliveryId);
        return ResponseEntity.ok(rows);
    }

    // ------------------------------------------------------
    // PUT paki uuendamine (woodType, assortment, volume, jne)
    // ------------------------------------------------------
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
