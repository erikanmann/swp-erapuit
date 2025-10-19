package com.erapuit.backend.service;

import org.springframework.stereotype.Service;
import com.erapuit.backend.model.Delivery;
import com.erapuit.backend.repository.DeliveryRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DeliveryService {

    private final DeliveryRepository repo;

    public DeliveryService(DeliveryRepository repo) {
        this.repo = repo;
    }

    // --- GET kõik tarneid ---
    public List<Delivery> getAll() {
        return repo.findAll();
    }

    // --- POST / salvestamine ---
    public Delivery save(Delivery delivery) {
        repo.findByWaybillNo(delivery.getWaybillNo())
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Sama veoselehe numbriga tarne on juba süsteemis olemas.");
                });
        if (delivery.getCreatedAt() == null) {
            delivery.setCreatedAt(OffsetDateTime.now());
        }
        return repo.save(delivery);
    }

    // --- DELETE ---
    public boolean deleteById(UUID id) {
        if (!repo.existsById(id)) {
            return false;
        }
        repo.deleteById(id);
        return true;
    }
}
