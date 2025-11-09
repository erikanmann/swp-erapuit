package com.erapuit.backend.controller;

import com.erapuit.backend.model.Delivery;
import com.erapuit.backend.repository.DeliveryRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID; // 👈 lisa UUID import

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "http://localhost:3000")
public class StockController {

    private final DeliveryRepository deliveryRepository;

    public StockController(DeliveryRepository deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }

    // --- US7: kuvab kõik tarned (total + usable volume) ---
    @GetMapping
    public List<Delivery> getAllStock() {
        return deliveryRepository.findAll();
    }

    // --- US9: uuendab usable volume (actual_volume_tm) ---
    @PutMapping("/{id}/usable-volume")
    public Delivery updateUsableVolume(@PathVariable UUID id, @RequestBody Delivery updatedDelivery) {
        return deliveryRepository.findById(id)
                .map(existing -> {
                    existing.setActualVolumeTm(updatedDelivery.getActualVolumeTm());
                    return deliveryRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
    }
}
