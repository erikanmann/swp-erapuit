package com.erapuit.backend.service;

import com.erapuit.backend.dto.IncomingWaybillDto;
import com.erapuit.backend.evr.EvrApiClient;
import com.erapuit.backend.model.Delivery;
import com.erapuit.backend.model.DeliveryPackage;
import com.erapuit.backend.model.DeliveryStatus;
import com.erapuit.backend.model.StockItem;
import com.erapuit.backend.repository.DeliveryRepository;
import com.erapuit.backend.repository.StockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class DeliveryService {

    private final DeliveryRepository repo;
    private final EvrApiClient evrApiClient;
    private final StockRepository stockRepository;
    private final DeliveryPackageService deliveryPackageService;

    public DeliveryService(
            DeliveryRepository repo,
            EvrApiClient evrApiClient,
            StockRepository stockRepository,
            DeliveryPackageService deliveryPackageService
    ) {
        this.repo = repo;
        this.evrApiClient = evrApiClient;
        this.stockRepository = stockRepository;
        this.deliveryPackageService = deliveryPackageService;
    }

    public List<Delivery> getAll() {
        return repo.findAll();
    }

    // ---------------------------------------------------------
    // KÄSITSI SISSESTATUD TARNE
    // ---------------------------------------------------------
    public Delivery save(Delivery delivery) {

        repo.findByWaybillNo(delivery.getWaybillNo())
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Sama veoselehe numbriga tarne on juba süsteemis olemas.");
                });

        if (delivery.getCreatedAt() == null) {
            delivery.setCreatedAt(OffsetDateTime.now());
        }
        if (delivery.getDeliveryStatus() == null) {
            delivery.setDeliveryStatus(DeliveryStatus.RECEIVED);
        }

        Delivery saved = repo.save(delivery);

        // Käsitsi sisestus → tekitame ühe vaikimisi paki
        DeliveryPackage pkg = deliveryPackageService.createAutomaticPackage(saved);

        // Loo stockitems selle paki alusel
        createStockForPackages(saved, List.of(pkg));

        return saved;
    }

    // ---------------------------------------------------------
    // DELETE TARNE
    // ---------------------------------------------------------
    @Transactional
    public boolean deleteById(UUID id) {
        return repo.findById(id).map(delivery -> {
            // Kustutab kõik stockitems read, mis viitavad antud tarne ID-le
            stockRepository.deleteByDeliveryId(delivery.getId());
            repo.delete(delivery);
            return true;
        }).orElse(false);
    }

    // ---------------------------------------------------------
    // UPDATE TARNE
    // ---------------------------------------------------------
    public Delivery update(UUID id, Delivery updatedDelivery) {
        Delivery existing = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found with id: " + id));

        existing.setDriverName(updatedDelivery.getDriverName());
        existing.setTruckNo(updatedDelivery.getTruckNo());
        existing.setWaybillNo(updatedDelivery.getWaybillNo());
        existing.setSupplierName(updatedDelivery.getSupplierName());
        existing.setSupplierAddress(updatedDelivery.getSupplierAddress());
        existing.setWoodType(updatedDelivery.getWoodType());
        existing.setArrivalDate(updatedDelivery.getArrivalDate());

        if (updatedDelivery.getTotalVolumeTm() != null) {
            existing.setTotalVolumeTm(updatedDelivery.getTotalVolumeTm());
        }

        return repo.save(existing);
    }

    // ---------------------------------------------------------
    // EVR: PÄIS
    // ---------------------------------------------------------
    public List<IncomingWaybillDto> getIncomingFromEvr() {
        return evrApiClient.getIncomingLoads();
    }

    // ---------------------------------------------------------
    // EVR: TÄISIMPORT
    // ---------------------------------------------------------
    public Delivery createFromEvr(IncomingWaybillDto dto) {

        var existing = repo.findByWaybillNo(dto.getWaybillNumber());
        if (existing.isPresent()) {
            return existing.get();
        }

        EvrApiClient.WaybillDetail detail = evrApiClient.getWaybillDetail(dto.getWaybillNumber());

        double totalTm = 0.0;
        String woodType = null;
        List<ParsedWaybillRow> parsedRows = new ArrayList<>();
        int autoPackageNo = 0;

        // EVR read → paki loend
        if (detail != null && detail.shipments != null) {
            for (var shipment : detail.shipments) {
                if (shipment.items != null) {
                    for (var item : shipment.items) {

                        if ("tm".equalsIgnoreCase(item.unitCode)) {
                            totalTm += item.amount != null ? item.amount : 0.0;
                            if (woodType == null && item.assortment != null) {
                                woodType = item.assortment.name;
                            }
                        }

                        autoPackageNo++;
                        ParsedWaybillRow row = new ParsedWaybillRow();
                        row.setPackageNo(autoPackageNo);
                        row.setWoodType(item.assortment != null ? item.assortment.name : null);
                        row.setAssortment(item.assortment != null ? item.assortment.name : null);
                        row.setVolume(item.amount != null ? item.amount : 0.0);

                        parsedRows.add(row);
                    }
                }
            }
        }

        if (totalTm == 0.0 && dto.getMass() != null) {
            totalTm = dto.getMass();
        }

        OffsetDateTime arrival = null;
        if (detail != null) {
            arrival = (detail.unloadingTime != null) ? detail.unloadingTime : detail.departureTime;
        }
        if (arrival == null) {
            arrival = OffsetDateTime.now();
        }

        String supplierName = dto.getWoodOwnerName();
        if ((supplierName == null || supplierName.isBlank()) && detail != null && detail.owner != null) {
            supplierName = detail.owner.name;
        }
        if (supplierName == null || supplierName.isBlank()) {
            supplierName = "Tundmatu tarnija";
        }

        String supplierAddress = null;
        if (detail != null && detail.owner != null && detail.owner.address != null) {
            var a = detail.owner.address;
            supplierAddress =
                    (a.street != null ? a.street : "") +
                            (a.city != null ? ", " + a.city : "") +
                            (a.county != null ? ", " + a.county : "");
        }

        Delivery delivery = new Delivery();
        delivery.setWaybillNo(dto.getWaybillNumber());
        delivery.setDriverName(dto.getDriverName());
        delivery.setTruckNo(dto.getTruckNo());
        delivery.setSupplierName(supplierName);
        delivery.setSupplierAddress(supplierAddress);
        delivery.setWoodType(woodType);
        delivery.setTotalVolumeTm(BigDecimal.valueOf(totalTm));
        delivery.setArrivalDate(arrival);
        delivery.setCreatedAt(arrival);
        delivery.setDeliveryStatus(DeliveryStatus.RECEIVED);

        Delivery saved = repo.save(delivery);

        // Loo pakkide read
        List<DeliveryPackage> packages = deliveryPackageService.savePackages(saved.getId(), parsedRows);

        // Loo stockitems iga pakiga
        createStockForPackages(saved, packages);

        return saved;
    }

    // ---------------------------------------------------------
    // STOCKITEMI LOOMINE PAKKIDE PÕHJAL
    // ---------------------------------------------------------
    private void createStockForPackages(Delivery saved, List<DeliveryPackage> packages) {

        for (DeliveryPackage pkg : packages) {

            StockItem stock = new StockItem();

            stock.setDeliveryId(saved.getId());
            stock.setDeliveryPackageId(pkg.getId());
            stock.setPackageCode(pkg.getFinalCode());

            stock.setSupplier(saved.getSupplierName());
            stock.setWoodType(pkg.getWoodType() != null ? pkg.getWoodType() : saved.getWoodType());
            stock.setArrivalDate(saved.getArrivalDate());

            BigDecimal total = pkg.getVolumeTm() != null ? pkg.getVolumeTm() : BigDecimal.ZERO;

            stock.setTotalVolume(total);
            stock.setUsableVolume(total);

            stockRepository.save(stock);
        }
    }

    public List<DeliveryPackage> getPackagesForDelivery(UUID deliveryId) {
        return deliveryPackageService.getPackagesForDelivery(deliveryId);
    }
}
