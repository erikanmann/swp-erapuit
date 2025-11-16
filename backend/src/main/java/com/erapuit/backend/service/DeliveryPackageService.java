package com.erapuit.backend.service;

import com.erapuit.backend.model.Delivery;
import com.erapuit.backend.model.DeliveryPackage;
import com.erapuit.backend.repository.DeliveryPackageRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class DeliveryPackageService {

    private final DeliveryPackageRepository repo;

    public DeliveryPackageService(DeliveryPackageRepository repo) {
        this.repo = repo;
    }

    public List<DeliveryPackage> savePackages(UUID deliveryId, List<ParsedWaybillRow> rows) {

        Map<Integer, Integer> counters = new HashMap<>();
        List<DeliveryPackage> result = new ArrayList<>();

        for (ParsedWaybillRow row : rows) {
            if (row.getPackageNo() == null) {
                continue;
            }

            int pkgNo = row.getPackageNo();
            int subIndex = counters.getOrDefault(pkgNo, 0) + 1;
            counters.put(pkgNo, subIndex);

            DeliveryPackage p = new DeliveryPackage();
            p.setDeliveryId(deliveryId);
            p.setPackageNo(pkgNo);
            p.setSubIndex(subIndex);
            p.setFinalCode(pkgNo + "-" + subIndex);

            p.setWoodType(row.getWoodType());
            p.setAssortment(row.getAssortment());
            p.setVolumeTm(
                    row.getVolume() != null
                            ? BigDecimal.valueOf(row.getVolume())
                            : BigDecimal.ZERO
            );

            p.setTrailer(row.getTrailer() != null && row.getTrailer());

            result.add(repo.save(p));
        }

        return result;
    }

    // --- UUED FUNKTSIOON: ühe automaatse paki loomine käsitsi sisestuse jaoks ---
    public DeliveryPackage createAutomaticPackage(Delivery delivery) {

        DeliveryPackage pkg = new DeliveryPackage();

        pkg.setDeliveryId(delivery.getId());
        pkg.setPackageNo(1);
        pkg.setSubIndex(1);
        pkg.setFinalCode("1-1");

        pkg.setWoodType(delivery.getWoodType());
        pkg.setAssortment(delivery.getWoodType());

        if (delivery.getTotalVolumeTm() != null) {
            pkg.setVolumeTm(delivery.getTotalVolumeTm());
        } else {
            pkg.setVolumeTm(BigDecimal.ZERO);
        }

        pkg.setTrailer(false);

        return repo.save(pkg);
    }

    public List<DeliveryPackage> getPackagesForDelivery(UUID deliveryId) {
        return repo.findByDeliveryId(deliveryId);
    }

    public DeliveryPackage updatePackage(UUID id, DeliveryPackage input) {
        DeliveryPackage pkg = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Package not found"));

        pkg.setWoodType(input.getWoodType());
        pkg.setAssortment(input.getAssortment());
        pkg.setVolumeTm(input.getVolumeTm());
        pkg.setTrailer(input.getTrailer());

        return repo.save(pkg);
    }

    public DeliveryPackage getOnePackage(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Package not found"));
    }


}
