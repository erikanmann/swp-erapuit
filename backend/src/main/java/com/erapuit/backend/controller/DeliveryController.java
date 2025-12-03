package com.erapuit.backend.controller;

import com.erapuit.backend.dto.IncomingWaybillDto;
import com.erapuit.backend.model.Delivery;
import com.erapuit.backend.model.DeliveryStatus;
import com.erapuit.backend.repository.DeliveryRepository;
import com.erapuit.backend.repository.StockRepository;
import com.erapuit.backend.service.DeliveryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "http://localhost:3000")
public class DeliveryController {

    private final DeliveryService service;
    private final DeliveryRepository deliveryRepository;
    private final StockRepository stockRepository;

    public DeliveryController(DeliveryService service,
                              DeliveryRepository deliveryRepository,
                              StockRepository stockRepository) {
        this.service = service;
        this.deliveryRepository = deliveryRepository;
        this.stockRepository = stockRepository;
    }

    // --- GET: tarnefiltrid ---
    @GetMapping("/incoming")
    public List<Delivery> getIncomingMaterials(@RequestParam(required = false) String period) {
        OffsetDateTime today = OffsetDateTime.now();
        OffsetDateTime startDate;

        switch (period) {
            case "week":
                startDate = today.minusWeeks(1);
                return deliveryRepository.findByArrivalDateGreaterThanEqual(startDate);

            case "month":
                startDate = today.minusMonths(1);
                return deliveryRepository.findByArrivalDateGreaterThanEqual(startDate);

            case "year":
                startDate = today.minusYears(1);
                return deliveryRepository.findByArrivalDateGreaterThanEqual(startDate);

            case "all":
            default:
                return deliveryRepository.findAll();
        }
    }

    @GetMapping
    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    // --- GET: üks delivery ID järgi ---
    @GetMapping("/{id}")
    public ResponseEntity<Delivery> getById(@PathVariable UUID id) {
        return deliveryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- GET: pakkide loetelu delivery kohta ---
    @GetMapping("/{id}/packages")
    public ResponseEntity<?> getDeliveryPackages(@PathVariable UUID id) {

        // Kontrollime, kas tarne üldse eksisteerib
        return deliveryRepository.findById(id)
                .map(delivery -> {
                    var packages = service.getPackagesForDelivery(id);
                    return ResponseEntity.ok(packages);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }



    // --- POST: käsitsi sisestatud delivery ---
    @PostMapping
    public ResponseEntity<Delivery> create(@RequestBody Delivery delivery) {

        if (delivery.getDeliveryStatus() == null) {
            delivery.setDeliveryStatus(DeliveryStatus.RECEIVED);
        }

        Delivery saved = service.save(delivery);

        return ResponseEntity.ok(saved);
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

    // --- PUT ---
    @PutMapping("/{id}")
    public ResponseEntity<Delivery> update(@PathVariable UUID id,
                                           @RequestBody Delivery updatedDelivery) {
        try {
            Delivery saved = service.update(id, updatedDelivery);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // --- EVR: koormate päise info ---
    @GetMapping("/evr-incoming")
    public List<IncomingWaybillDto> getIncomingEvrLoads() {
        return service.getIncomingFromEvr();
    }

    // --- EVR: koorma salvestamine detailinfo põhjal ---
    @PostMapping("/from-evr")
    public ResponseEntity<Delivery> createFromEvr(@RequestBody IncomingWaybillDto dto) {
        Delivery saved = service.createFromEvr(dto);
        return ResponseEntity.ok(saved);
    }
}
