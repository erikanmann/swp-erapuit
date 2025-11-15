package com.erapuit.backend.service;

import com.erapuit.backend.dto.IncomingWaybillDto;
import com.erapuit.backend.evr.EvrApiClient;
import com.erapuit.backend.model.Delivery;
import com.erapuit.backend.model.DeliveryStatus;
import com.erapuit.backend.model.StockItem;
import com.erapuit.backend.repository.DeliveryRepository;
import com.erapuit.backend.repository.StockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DeliveryService {

    private final DeliveryRepository repo;
    private final EvrApiClient evrApiClient;
    private final StockRepository stockRepository;

    public DeliveryService(DeliveryRepository repo,
                           EvrApiClient evrApiClient,
                           StockRepository stockRepository) {
        this.repo = repo;
        this.evrApiClient = evrApiClient;
        this.stockRepository = stockRepository;
    }

    // --- GET kõik tarneid ---
    public List<Delivery> getAll() {
        return repo.findAll();
    }

    // --- POST / salvestamine (tavaline käsitsi sisestus) ---
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

        createStockFromDelivery(saved);

        return saved;
    }

    // --- DELETE ---
    @Transactional
    public boolean deleteById(UUID id) {
        return repo.findById(id).map(delivery -> {
            stockRepository.deleteByDeliveryId(delivery.getId().toString());
            repo.delete(delivery);
            return true;
        }).orElse(false);
    }


    // --- PUT / uuendamine ---
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

    // --- EVR: koormate päise info ---
    public List<IncomingWaybillDto> getIncomingFromEvr() {
        return evrApiClient.getIncomingLoads();
    }

    // --- EVR: uue Delivery loomine detailinfo põhjal ---
    public Delivery createFromEvr(IncomingWaybillDto dto) {

        // Kontrolli duplikaate
        repo.findByWaybillNo(dto.getWaybillNumber())
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Selle veoselehega tarne on juba süsteemis olemas.");
                });

        // 1) Võta detailandmed EVR-ist
        EvrApiClient.WaybillDetail detail =
                evrApiClient.getWaybillDetail(dto.getWaybillNumber());

        double totalTm = 0.0;
        String woodType = null;

        // 2) Loe pakkide info (shipments → items)
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
                    }
                }
            }
        }

        // Kui kogus tuli detailist 0, kasuta päise massi fallbackina
        if (totalTm == 0.0 && dto.getMass() != null) {
            totalTm = dto.getMass();
        }

        // 3) Määra saabumisaeg:
        OffsetDateTime arrival = null;
        if (detail != null) {
            if (detail.unloadingTime != null) {
                arrival = detail.unloadingTime;
            } else if (detail.departureTime != null) {
                arrival = detail.departureTime;
            }
        }
        if (arrival == null) {
            arrival = OffsetDateTime.now();
        }

        // 4) Supplier name
        String supplierName = dto.getWoodOwnerName();

        if (supplierName == null || supplierName.isBlank()) {
            if (detail != null && detail.owner != null && detail.owner.name != null) {
                supplierName = detail.owner.name;
            }
        }

        if (supplierName == null || supplierName.isBlank()) {
            supplierName = "Tundmatu tarnija";
        }

        // 5) Supplier address (optional)
        String supplierAddress = null;
        if (detail != null && detail.owner != null && detail.owner.address != null) {
            var a = detail.owner.address;
            supplierAddress =
                    (a.street != null ? a.street : "")
                            + (a.city != null ? ", " + a.city : "")
                            + (a.county != null ? ", " + a.county : "");
        }

        // 6) Loo Delivery objekt
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

        // 7) Loo ka StockItem
        createStockFromDelivery(saved);

        return saved;
    }

    // --- abimeetod StockItem loomiseks ---
    private void createStockFromDelivery(Delivery saved) {
        StockItem stock = new StockItem();
        stock.setDeliveryId(saved.getId().toString());
        stock.setSupplier(saved.getSupplierName());
        stock.setWoodType(saved.getWoodType());
        stock.setArrivalDate(
                saved.getArrivalDate() != null
                        ? saved.getArrivalDate().toString()
                        : OffsetDateTime.now().toString()
        );

        double total = saved.getTotalVolumeTm() != null
                ? saved.getTotalVolumeTm().doubleValue()
                : 0.0;

        stock.setTotalVolume(total);
        stock.setUsableVolume(total);

        stockRepository.save(stock);
    }
}
