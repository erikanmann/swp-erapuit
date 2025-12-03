package com.erapuit.backend.controller;

import com.erapuit.backend.model.Package;
import com.erapuit.backend.repository.PackageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/packages")
@CrossOrigin(origins = "http://localhost:3000")
public class PackageController {

    private final PackageRepository packageRepository;

    public PackageController(PackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    @GetMapping
    public List<Package> getAllPackages() {
        return packageRepository.findAll();
    }

    @GetMapping("/{id}")
    public Package getPackage(@PathVariable UUID id) {
        return packageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Package not found"));
    }


    @GetMapping("/available")
    public List<Package> getAvailablePackages() {
        return packageRepository.findUnshippedPackages();
    }

    @PostMapping
    public Package createPackage(@RequestBody Package newPackage) {
        return packageRepository.save(newPackage);
    }

    @PutMapping("/{id}")
    public Package updatePackage(@PathVariable UUID id, @RequestBody Package updated) {
        return packageRepository.findById(id)
                .map(existing -> {
                    existing.setProductId(updated.getProductId());
                    existing.setWeightKg(updated.getWeightKg());
                    existing.setCount(updated.getCount());
                    existing.setVolumeM3(updated.getVolumeM3());
                    existing.setLocation(updated.getLocation());
                    return packageRepository.save(existing);
                })
                .orElseThrow(() -> new IllegalArgumentException("Package not found"));
    }

    @DeleteMapping("/{id}")
    public void deletePackage(@PathVariable UUID id) {
        packageRepository.deleteById(id);
    }
}
