package com.erapuit.backend.controller;

import com.erapuit.backend.model.Delivery;
import com.erapuit.backend.service.DeliveryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "http://localhost:3000") // võimaldab Reactil kasutada API-t
public class DeliveryController {

    private final DeliveryService service;

    public DeliveryController(DeliveryService service) {
        this.service = service;
    }

    // --- GET ---
    @GetMapping
    public List<Delivery> list() {
        return service.getAll();
    }

    // --- POST ---
    @PostMapping
    public ResponseEntity<Delivery> create(@RequestBody Delivery delivery) {
        Delivery saved = service.save(delivery);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // --- DELETE ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        boolean deleted = service.deleteById(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
