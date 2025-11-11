package com.erapuit.backend.controller;

import com.erapuit.backend.model.Delivery;
import com.erapuit.backend.model.DeliveryStatus;
import com.erapuit.backend.model.StockItem;
import com.erapuit.backend.repository.DeliveryRepository;
import com.erapuit.backend.repository.StockRepository;
import com.erapuit.backend.service.DeliveryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "http://localhost:3000") // võimaldab Reactil kasutada API-t
public class DeliveryController {

    private final DeliveryService service;
    private final DeliveryRepository deliveryRepository;
    private final StockRepository stockRepository;

    public DeliveryController(DeliveryService service, DeliveryRepository deliveryRepository, StockRepository stockRepository) {
        this.service = service;
        this.deliveryRepository = deliveryRepository;
        this.stockRepository = stockRepository;
    }

    // --- GET ---
    @GetMapping("/incoming")
    public List<Delivery> getIncomingMaterials(@RequestParam(required = false) String period) {
        LocalDate startDate;
        LocalDate today = LocalDate.now();

        if (period == null || period.equals("all")) {
            return deliveryRepository.findAll();
        }

        switch (period) {
            case "week":
                startDate = today.minusWeeks(1);
                break;
            case "month":
                startDate = today.minusMonths(1);
                break;
            case "year":
                startDate = today.minusYears(1);
                break;
            default:
                return deliveryRepository.findAll();
        }

        return deliveryRepository.findByArrivalDateGreaterThanEqual(startDate);
    }
    @GetMapping
    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }


    // --- POST ---
    @PostMapping
    public ResponseEntity<Delivery> create(@RequestBody Delivery delivery) {
        if (delivery.getDeliveryStatus() == null) {
            delivery.setDeliveryStatus(DeliveryStatus.RECEIVED);
        }
        Delivery saved = service.save(delivery);

        StockItem stock = new StockItem();
        stock.setDeliveryId(saved.getId().toString());
        stock.setSupplier(saved.getSupplierName());
        stock.setWoodType(saved.getWoodType());
        stock.setArrivalDate(saved.getArrivalDate().toString());
        stock.setTotalVolume(saved.getTotalVolumeTm() != null ? saved.getTotalVolumeTm().doubleValue() : 0.0);
        stock.setUsableVolume(saved.getTotalVolumeTm() != null ? saved.getTotalVolumeTm().doubleValue() : 0.0);

        stockRepository.save(stock);

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
    // Uuendab olemasolevat tarnet ID alusel
    @PutMapping("/{id}")
    public ResponseEntity<Delivery> update(@PathVariable UUID id, @RequestBody Delivery updatedDelivery) {
        try {
            Delivery saved = service.update(id, updatedDelivery);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleDuplicateReference(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

}
