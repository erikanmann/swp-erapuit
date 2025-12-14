package com.erapuit.backend.service;

import com.erapuit.backend.dto.CreatePackageRequest;
import com.erapuit.backend.dto.CreatePackageWithItemsRequest;
import com.erapuit.backend.model.Package;
import com.erapuit.backend.model.PackageItem;
import com.erapuit.backend.model.Product;
import com.erapuit.backend.model.ProductionOutput;
import com.erapuit.backend.repository.PackageItemRepository;
import com.erapuit.backend.repository.PackageRepository;
import com.erapuit.backend.repository.ProductRepository;
import com.erapuit.backend.repository.ProductionOutputRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class PackageService {

    private final PackageRepository packageRepository;
    private final ProductRepository productRepository;
    private final PackageItemRepository packageItemRepository;
    private final ProductionOutputRepository productionOutputRepository;

    public PackageService(
            PackageRepository packageRepository,
            ProductRepository productRepository,
            PackageItemRepository packageItemRepository,
            ProductionOutputRepository productionOutputRepository
    ) {
        this.packageRepository = packageRepository;
        this.productRepository = productRepository;
        this.packageItemRepository = packageItemRepository;
        this.productionOutputRepository = productionOutputRepository;
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

    // --- LEGACY: single-product package ---
    public Package createPackage(CreatePackageRequest req) {

        Product product = productRepository.findById(req.productId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        BigDecimal volume = req.volumeM3();
        if (volume == null) {
            volume = product.calculateUnitVolumeM3()
                    .multiply(BigDecimal.valueOf(req.count()));
        }

        Package pkg = new Package();
        pkg.setProductId(req.productId());
        pkg.setCount(req.count());
        pkg.setVolumeM3(volume);
        pkg.setWeightKg(req.weightKg());
        pkg.setLocation(req.location());

        return packageRepository.save(pkg);
    }

    // --- AVAILABLE ---
    public List<Package> getAvailablePackages() {
        return packageRepository.findUnshippedPackages();
    }

    @Transactional
    public Package createPackageWithItems(CreatePackageWithItemsRequest req) {

        if (req.items() == null || req.items().isEmpty()) {
            throw new IllegalArgumentException("Package must contain at least one item");
        }

        Package pkg = new Package();
        pkg.setLocation(req.location());
        pkg = packageRepository.save(pkg);

        for (CreatePackageWithItemsRequest.Item item : req.items()) {

            if (item.productionOutputId() == null || item.count() == null) {
                throw new IllegalArgumentException("Invalid package item");
            }

            ProductionOutput po = productionOutputRepository
                    .findById(item.productionOutputId())
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "ProductionOutput not found: " + item.productionOutputId()
                            )
                    );

            if (item.count() <= 0) {
                throw new IllegalArgumentException("Count must be greater than zero");
            }

            if (item.count() > po.getCount()) {
                throw new IllegalArgumentException(
                        "Not enough available output. Available: " + po.getCount()
                );
            }

            po.setCount(po.getCount() - item.count());
            if (po.getCount() == 0) {
                po.setPackaged(true);
            }
            productionOutputRepository.save(po);

            PackageItem pi = new PackageItem();
            pi.setPackageId(pkg.getId());
            pi.setProductionOutputId(po.getId());
            pi.setCount(item.count());

            packageItemRepository.save(pi);
        }

        return pkg;
    }



    // --- UPDATE ---
    public Package updatePackage(UUID id, Package updated) {
        return packageRepository.findById(id)
                .map(existing -> {
                    existing.setProductId(updated.getProductId());
                    existing.setCount(updated.getCount());
                    existing.setVolumeM3(updated.getVolumeM3());
                    existing.setWeightKg(updated.getWeightKg());
                    existing.setLocation(updated.getLocation());
                    return packageRepository.save(existing);
                })
                .orElseThrow(() -> new IllegalArgumentException("Package not found: " + id));
    }

    // --- DELETE ---
    public void deletePackage(UUID id) {
        packageRepository.deleteById(id);
    }

}
