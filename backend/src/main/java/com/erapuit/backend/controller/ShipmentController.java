package com.erapuit.backend.controller;

import com.erapuit.backend.model.Shipment;
import com.erapuit.backend.model.ShipmentItem;
import com.erapuit.backend.repository.ShipmentItemRepository;
import com.erapuit.backend.repository.ShipmentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/shipments")
@CrossOrigin(origins = "http://localhost:3000")
public class ShipmentController {

    private final ShipmentRepository shipmentRepository;
    private final ShipmentItemRepository shipmentItemRepository;

    public ShipmentController(ShipmentRepository shipmentRepository,
                              ShipmentItemRepository shipmentItemRepository) {
        this.shipmentRepository = shipmentRepository;
        this.shipmentItemRepository = shipmentItemRepository;
    }

    // --- 0. Üksiku saadetise päring ---
    @GetMapping("/{id}")
    public Shipment getShipment(@PathVariable UUID id) {
        return shipmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Saadetist ei leitud."));
    }

    // --- 1. Kõik saadetised ---
    @GetMapping
    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

    // --- 2. Loo uus saadetis ---
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public Shipment createShipment(@RequestBody Shipment shipment) {
        // kontroll: saatelehe number on kohustuslik
        if (shipment.getDeliveryNoteNo() == null || shipment.getDeliveryNoteNo().isBlank()) {
            throw new IllegalArgumentException("Saatelehe number on kohustuslik.");

        }

        // kontroll: saadetise kuupäev, kui puudu
        if (shipment.getDateSent() == null) {
            shipment.setDateSent(OffsetDateTime.now());
        }

        // salvesta saadetis
        Shipment saved = shipmentRepository.save(shipment);

        // salvesta seotud pakid shipment_item tabelisse
        if (shipment.getPackageIds() != null && !shipment.getPackageIds().isEmpty()) {
            for (UUID pkgId : shipment.getPackageIds()) {
                ShipmentItem item = new ShipmentItem();
                item.setShipmentId(saved.getId());
                item.setPackageId(pkgId);
                item.setQuantity(1); // DB column is NOT NULL with default 1, set explicitly to avoid constraint violation
                shipmentItemRepository.save(item);
            }
        }

        return saved;
    }

    // --- 3. Uuenda saadetist ---
    @PutMapping("/{id}")
    @Transactional
    public Shipment updateShipment(@PathVariable UUID id, @RequestBody Shipment updated) {
        return shipmentRepository.findById(id)
                .map(existing -> {
                    // saatelehe number (kohustuslik, ei tohi tühjaks muuta)
                    if (updated.getDeliveryNoteNo() != null && !updated.getDeliveryNoteNo().isBlank()) {
                        existing.setDeliveryNoteNo(updated.getDeliveryNoteNo());
                    }

                    // sõiduki nr
                    if (updated.getVehicleNo() != null) {
                        existing.setVehicleNo(updated.getVehicleNo());
                    }

                    // klient
                    if (updated.getCustomer() != null) {
                        existing.setCustomer(updated.getCustomer());
                    }

                    // transpordifirma
                    if (updated.getTransportCompany() != null) {
                        existing.setTransportCompany(updated.getTransportCompany());
                    }

                    // kuupäeva uuendamine (säilita vana kui uut pole)
                    if (updated.getDateSent() != null) {
                        existing.setDateSent(updated.getDateSent());
                    } else if (existing.getDateSent() == null) {
                        existing.setDateSent(OffsetDateTime.now());
                    }

                    Shipment saved = shipmentRepository.save(existing);

                    // uuenda seotud paketid, kui packageIds on kaasas
                    if (updated.getPackageIds() != null) {
                        List<ShipmentItem> existingItems = shipmentItemRepository.findByShipmentId(id);

                        // eemalda need, mis pole enam valikus
                        for (ShipmentItem item : existingItems) {
                            if (!updated.getPackageIds().contains(item.getPackageId())) {
                                shipmentItemRepository.delete(item);
                            }
                        }

                        // lisa uued seosed
                        for (UUID pkgId : updated.getPackageIds()) {
                            boolean alreadyLinkedHere = existingItems.stream()
                                    .anyMatch(it -> it.getPackageId().equals(pkgId));
                            if (alreadyLinkedHere) continue;

                            // kontrolli, et pakk pole teise saadetisega seotud
                            List<ShipmentItem> byPackage = shipmentItemRepository.findByPackageId(pkgId);
                            boolean linkedElsewhere = byPackage.stream()
                                    .anyMatch(it -> !it.getShipmentId().equals(id));
                            if (linkedElsewhere) {
                                throw new IllegalArgumentException("Pakk on juba teises saadetises.");
                            }

                            ShipmentItem newItem = new ShipmentItem();
                            newItem.setShipmentId(id);
                            newItem.setPackageId(pkgId);
                            newItem.setQuantity(1);
                            shipmentItemRepository.save(newItem);
                        }
                    }

                    return saved;
                })
                .orElseThrow(() -> new IllegalArgumentException("Saadetist ei leitud."));
    }

    // --- 3b. Tagasta saadetisega seotud read ---
    @GetMapping("/{id}/items")
    public List<ShipmentItem> getShipmentItems(@PathVariable UUID id) {
        return shipmentItemRepository.findByShipmentId(id);
    }

    // --- 4. Kustuta saadetis koos seostega ---
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void deleteShipment(@PathVariable UUID id) {
        // eemalda shipment_item seosed
        List<ShipmentItem> items = shipmentItemRepository.findByShipmentId(id);
        if (!items.isEmpty()) {
            shipmentItemRepository.deleteAll(items);
        }

        // kustuta saadetis
        shipmentRepository.deleteById(id);
    }
}
