package com.erapuit.backend.service;

import org.springframework.stereotype.Service;
import com.erapuit.backend.model.Delivery;
import com.erapuit.backend.repository.DeliveryRepository;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class DeliveryService {

    private final DeliveryRepository repo;

    public DeliveryService(DeliveryRepository repo) {
        this.repo = repo;
    }

    public List<Delivery> getAll() {
        return repo.findAll();
    }

    public Delivery save(Delivery delivery) {
        if (delivery.getCreatedAt() == null) {
            delivery.setCreatedAt(OffsetDateTime.now());
        }

        return repo.save(delivery);
    }
}
