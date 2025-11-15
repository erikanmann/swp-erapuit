package com.erapuit.backend.service;

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

    public List<DeliveryPackage> savePackages(java.util.UUID deliveryId,
                                              java.util.List<ParsedWaybillRow> rows) {

        Map<Integer, Integer> counters = new HashMap<>();
        List<DeliveryPackage> result = new ArrayList<>();

        for (ParsedWaybillRow row : rows) {
            if (row.getPackageNo() == null) {
                // kui paketinumber puudub, jätame selle rea hetkel vahele
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

            p.setTrailer(row.getTrailer());

            result.add(repo.save(p));
        }

        return result;
    }

    public java.util.List<DeliveryPackage> getPackagesForDelivery(java.util.UUID deliveryId) {
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
}
