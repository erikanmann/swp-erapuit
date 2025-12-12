package com.erapuit.backend.repository;

import com.erapuit.backend.model.PackageItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PackageItemRepository
        extends JpaRepository<PackageItem, UUID> {
}
