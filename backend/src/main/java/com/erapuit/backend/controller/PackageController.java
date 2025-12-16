package com.erapuit.backend.controller;

import com.erapuit.backend.dto.AvailablePackageDto;
import com.erapuit.backend.dto.CreatePackageRequest;
import com.erapuit.backend.dto.CreatePackageWithItemsRequest;
import com.erapuit.backend.model.Package;
import com.erapuit.backend.service.PackageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/packages")
@CrossOrigin(origins = "http://localhost:3000")
public class PackageController {

    private final PackageService packageService;

    // ⭐ ÕIGE KONSTRUKTOR
    public PackageController(PackageService packageService) {
        this.packageService = packageService;
    }

    // Kõik pakid
    @GetMapping
    public List<Package> getAllPackages() {
        return packageService.getAllPackages();
    }

    // Üks pakk
    @GetMapping("/{id}")
    public Package getPackage(@PathVariable UUID id) {
        return packageService.getPackage(id);
    }

    //Saadaval pakid (millel puudub ShipmentItem)
    @GetMapping("/available")
    public List<AvailablePackageDto> getAvailablePackages() {
        return packageService.getAvailablePackagesDetailed();
    }

    //UUS — Paki loomine DTO kaudu (mitte raw entity)
    @PostMapping
    public Package createPackage(@RequestBody CreatePackageRequest req) {
        return packageService.createPackage(req);
    }

    // Paki uuendamine (soovi korral võib samuti teenusesse viia)
    @PutMapping("/{id}")
    public Package updatePackage(@PathVariable UUID id, @RequestBody Package updated) {
        return packageService.updatePackage(id, updated);
    }

    // Paki kustutamine
    @DeleteMapping("/{id}")
    public void deletePackage(@PathVariable UUID id) {
        packageService.deletePackage(id);
    }
    @PostMapping("/with-items")
    public Package createPackageWithItems(
            @RequestBody CreatePackageWithItemsRequest req
    ) {
        return packageService.createPackageWithItems(req);
    }

}
