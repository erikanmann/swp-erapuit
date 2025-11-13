package com.erapuit.backend.service;

import com.erapuit.backend.model.StockItem;
import com.erapuit.backend.model.StockUsageByWoodTypeDto;
import com.erapuit.backend.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StockService {

    private final StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    // UC2: põhidashboard – kõik laokirjed
    public List<StockItem> getAllStock() {
        return stockRepository.findAll();
    }

    // UC2: filter puuliigi järgi
    public List<StockItem> getByWoodType(String woodType) {
        return stockRepository.findByWoodTypeIgnoreCase(woodType);
    }

    // UC2: kombineeritud filter (puuliik, tarnija, alates kuupäevast)
    public List<StockItem> filterStock(String woodType, String supplier, String fromDateStr) {
        List<StockItem> all = stockRepository.findAll();

        LocalDate fromDate = null;
        if (fromDateStr != null && !fromDateStr.isBlank()) {
            try {
                fromDate = LocalDate.parse(fromDateStr);
            } catch (DateTimeParseException e) {
                // vale kuupäevavormingu korral lihtsalt ignoreerime kuupäevafiltrit
            }
        }

        LocalDate finalFromDate = fromDate;

        return all.stream()
                .filter(item -> {
                    if (woodType != null && !woodType.isBlank()) {
                        if (item.getWoodType() == null ||
                                !item.getWoodType().equalsIgnoreCase(woodType)) {
                            return false;
                        }
                    }
                    return true;
                })
                .filter(item -> {
                    if (supplier != null && !supplier.isBlank()) {
                        if (item.getSupplier() == null ||
                                !item.getSupplier().toLowerCase().contains(supplier.toLowerCase())) {
                            return false;
                        }
                    }
                    return true;
                })
                .filter(item -> {
                    if (finalFromDate == null) {
                        return true;
                    }
                    if (item.getArrivalDate() == null || item.getArrivalDate().isBlank()) {
                        return true; // kui kuupäev puudu, ei viska välja
                    }
                    try {
                        LocalDate arrival = LocalDate.parse(item.getArrivalDate());
                        return !arrival.isBefore(finalFromDate);
                    } catch (DateTimeParseException e) {
                        return true;
                    }
                })
                .collect(Collectors.toList());
    }

    // UC2: US 2.3 – muuta usableVolume
    public StockItem update(Long id, StockItem updated) {
        StockItem existing = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock item not found"));

        double newUsable = updated.getUsableVolume();
        if (newUsable < 0) {
            throw new RuntimeException("Usable volume cannot be negative");
        }
        if (newUsable > existing.getTotalVolume()) {
            throw new RuntimeException("Usable volume cannot be greater than total volume");
        }

        existing.setUsableVolume(newUsable);
        return stockRepository.save(existing);
    }

    // UC2: US 2.6 ja 2.7 – materjali kasutamine tootmises
    public StockItem useForProductionByType(String woodType, double usage) {
        if (usage <= 0) {
            throw new RuntimeException("Usage must be positive");
        }

        List<StockItem> items = stockRepository.findByWoodTypeIgnoreCase(woodType);

        if (items.isEmpty()) {
            throw new RuntimeException("Material not found: " + woodType);
        }

        // lihtne strateegia: leiame ühe partii, kus on piisavalt
        Optional<StockItem> maybeItem = items.stream()
                .filter(i -> i.getUsableVolume() >= usage)
                .findFirst();

        if (maybeItem.isEmpty()) {
            double totalAvailable = items.stream()
                    .mapToDouble(StockItem::getUsableVolume)
                    .sum();

            String alternatives = items.stream()
                    .map(i -> String.format(
                            "deliveryId=%s, usable=%.3f",
                            i.getDeliveryId(),
                            i.getUsableVolume()))
                    .collect(Collectors.joining("; "));

            String message = String.format(
                    "Not enough material in a single batch for %s. Requested: %.3f, total available: %.3f. " +
                            "Available per delivery: [%s]",
                    woodType, usage, totalAvailable, alternatives
            );

            throw new RuntimeException(message);
        }

        StockItem item = maybeItem.get();
        item.setUsableVolume(item.getUsableVolume() - usage);
        return stockRepository.save(item);
    }

    // UC2: US 2.4 – lihtne statistika materjali kasutuse kohta liigi kaupa
    public List<StockUsageByWoodTypeDto> getUsageByWoodType() {
        List<StockItem> all = stockRepository.findAll();

        Map<String, List<StockItem>> byType = all.stream()
                .collect(Collectors.groupingBy(item ->
                        item.getWoodType() == null ? "UNKNOWN" : item.getWoodType().toUpperCase()
                ));

        List<StockUsageByWoodTypeDto> result = new ArrayList<>();

        for (Map.Entry<String, List<StockItem>> entry : byType.entrySet()) {
            String type = entry.getKey();
            double total = entry.getValue().stream()
                    .mapToDouble(StockItem::getTotalVolume)
                    .sum();
            double usable = entry.getValue().stream()
                    .mapToDouble(StockItem::getUsableVolume)
                    .sum();
            double used = total - usable;

            StockUsageByWoodTypeDto dto = new StockUsageByWoodTypeDto();
            dto.setWoodType(type);
            dto.setTotalVolume(total);
            dto.setUsableVolume(usable);
            dto.setUsedVolume(used);

            result.add(dto);
        }

        return result;
    }
}
