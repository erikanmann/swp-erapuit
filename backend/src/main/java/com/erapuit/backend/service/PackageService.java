package com.erapuit.backend.service;

import com.erapuit.backend.dto.CreatePackageRequest;
import com.erapuit.backend.dto.CreatePackageWithItemsRequest;
import com.erapuit.backend.model.Package;
import com.erapuit.backend.model.PackageItem;
import com.erapuit.backend.model.Product;
import com.erapuit.backend.repository.PackageItemRepository;
import com.erapuit.backend.repository.PackageRepository;
import com.erapuit.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PackageService {

    private final PackageRepository packageRepository;
    private final ProductRepository productRepository;
    private final PackageItemRepository packageItemRepository;

    public PackageService(PackageRepository packageRepository,
                          ProductRepository productRepository,
                          PackageItemRepository packageItemRepository) {
        this.packageRepository = packageRepository;
        this.productRepository = productRepository;
        this.packageItemRepository = packageItemRepository;
    }


    // --- GET ALL ---
    public List<Package> getAllPackages() {
        return packageRepository.findAll();
    }

    // --- GET ONE ---
    public Package getPackage(UUID id) {
        return packageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Package not found: " + id));
    }

    // --- CREATE PACKAGE ---
    public Package createPackage(CreatePackageRequest req) {

        Product product = productRepository.findById(req.productId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        BigDecimal volume = req.volumeM3();

        // Kui klient ei anna mahtu → arvutame selle automaatselt
        if (volume == null) {
            BigDecimal unitVolume = product.calculateUnitVolumeM3();
            volume = unitVolume.multiply(BigDecimal.valueOf(req.count()));
        }

        Package pkg = new Package();
        pkg.setProductId(req.productId());
        pkg.setCount(req.count());
        pkg.setVolumeM3(volume);
        pkg.setWeightKg(req.weightKg());
        pkg.setLocation(req.location());

        return packageRepository.save(pkg);
    }

    // --- UPDATE ---
    public Package updatePackage(UUID id, Package updated) {
        return packageRepository.findById(id)
                .map(existing -> {
                    existing.setProductId(updated.getProductId());
                    existing.setWeightKg(updated.getWeightKg());
                    existing.setCount(updated.getCount());
                    existing.setVolumeM3(updated.getVolumeM3());
                    existing.setLocation(updated.getLocation());
                    return packageRepository.save(existing);
                })
                .orElseThrow(() -> new IllegalArgumentException("Package not found: " + id));
    }

    // --- DELETE ---
    public void deletePackage(UUID id) {
        packageRepository.deleteById(id);
    }

    // --- AVAILABLE PACKAGES (not yet shipped) ---
    public List<Package> getAvailablePackages() {
        return packageRepository.findUnshippedPackages();
    }


    @Transactional
    public Package createPackageWithItems(CreatePackageWithItemsRequest req) {

        Package pkg = new Package();
        pkg.setLocation(req.location());
        pkg.setCreatedAt(OffsetDateTime.now());

        Package saved = packageRepository.save(pkg);

        for (var item : req.items()) {
            PackageItem pi = new PackageItem();
            pi.setPackageId(saved.getId());
            pi.setProductionOutputId(item.productionOutputId());
            pi.setCount(item.count());
            packageItemRepository.save(pi);
        }

        return saved;
    }
}
