package com.erapuit.backend.controller;

import com.erapuit.backend.model.Shipment;
import com.erapuit.backend.repository.ShipmentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/shipments")
@CrossOrigin(origins = "http://localhost:3000")
public class ShipmentController {

    private final ShipmentRepository shipmentRepository;

    public ShipmentController(ShipmentRepository shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }

    @GetMapping
    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

    @PostMapping
    public Shipment createShipment(@RequestBody Shipment shipment) {
        return shipmentRepository.save(shipment);
    }

    @PutMapping("/{id}")
    public Shipment updateShipment(@PathVariable UUID id, @RequestBody Shipment updated) {
        return shipmentRepository.findById(id)
                .map(existing -> {
                    existing.setVehicleNo(updated.getVehicleNo());
                    existing.setDateSent(updated.getDateSent());
                    return shipmentRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteShipment(@PathVariable UUID id) {
        shipmentRepository.deleteById(id);
    }
}
