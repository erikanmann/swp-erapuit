package com.erapuit.backend.service;

import com.erapuit.backend.model.StockItem;
import com.erapuit.backend.model.StockUsageByWoodTypeDto;
import com.erapuit.backend.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.math.BigDecimal;

import com.erapuit.backend.dto.StockListDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

@Service
public class StockService {

    private final StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    // UC2: põhidashboard
    public List<StockItem> getAllStock() {
        return stockRepository.findAll();
    }

    public List<StockItem> getByWoodType(String woodType) {
        return stockRepository.findByWoodTypeIgnoreCase(woodType);
    }

    // UC2: kombineeritud filter
    public List<StockItem> filterStock(String woodType, String supplier, String fromDateStr) {
        List<StockItem> all = stockRepository.findAll();

        LocalDate fromDate = null;
        if (fromDateStr != null && !fromDateStr.isBlank()) {
            try {
                fromDate = LocalDate.parse(fromDateStr);
            } catch (Exception ignored) {}
        }

        LocalDate finalFromDate = fromDate;

        return all.stream()
                .filter(item -> {
                    if (woodType != null && !woodType.isBlank()) {
                        return item.getWoodType() != null &&
                                item.getWoodType().equalsIgnoreCase(woodType);
                    }
                    return true;
                })
                .filter(item -> {
                    if (supplier != null && !supplier.isBlank()) {
                        return item.getSupplier() != null &&
                                item.getSupplier().toLowerCase().contains(supplier.toLowerCase());
                    }
                    return true;
                })
                .filter(item -> {
                    if (finalFromDate == null) return true;
                    if (item.getArrivalDate() == null) return true;
                    return !item.getArrivalDate().toLocalDate().isBefore(finalFromDate);
                })
                .collect(Collectors.toList());
    }

    // UC2: US 2.3 – usable volume update
    public StockItem update(Long id, StockItem updated) {
        StockItem existing = stockRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Stock item not found"));

        BigDecimal newUsable = updated.getUsableVolume();

        if (newUsable.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Usable volume cannot be negative");
        }
        if (newUsable.compareTo(existing.getTotalVolume()) > 0) {
            throw new IllegalArgumentException("Usable volume cannot be greater than total volume");
        }

        existing.setUsableVolume(newUsable);
        return stockRepository.save(existing);
    }

    // UC2: US 2.4 – usage statistics
    public List<StockUsageByWoodTypeDto> getUsageByWoodType() {
        List<StockItem> all = stockRepository.findAll();

        Map<String, List<StockItem>> byType = all.stream()
                .collect(Collectors.groupingBy(item ->
                        item.getWoodType() == null ? "UNKNOWN" : item.getWoodType().toUpperCase()
                ));

        List<StockUsageByWoodTypeDto> result = new ArrayList<>();

        for (Map.Entry<String, List<StockItem>> entry : byType.entrySet()) {
            String type = entry.getKey();

            BigDecimal total = entry.getValue().stream()
                    .map(i -> i.getTotalVolume() != null ? i.getTotalVolume() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal usable = entry.getValue().stream()
                    .map(i -> i.getUsableVolume() != null ? i.getUsableVolume() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal used = total.subtract(usable);

            StockUsageByWoodTypeDto dto = new StockUsageByWoodTypeDto();
            dto.setWoodType(type);
            dto.setTotalVolume(total.doubleValue());
            dto.setUsableVolume(usable.doubleValue());
            dto.setUsedVolume(used.doubleValue());

            result.add(dto);
        }

        return result;
    }

    // UC2: US 2.6 – use material for production
    public StockItem useForProductionByType(String woodType, double usage) {

        if (usage <= 0) {
            throw new IllegalArgumentException("Usage must be positive");
        }

        List<StockItem> items = stockRepository.findByWoodTypeIgnoreCase(woodType);

        if (items.isEmpty()) {
            throw new IllegalArgumentException("Material not found: " + woodType);
        }

        BigDecimal required = BigDecimal.valueOf(usage);

        // find first item with enough usable volume
        Optional<StockItem> maybeItem = items.stream()
                .filter(i -> i.getUsableVolume() != null &&
                        i.getUsableVolume().compareTo(required) >= 0)
                .findFirst();

        if (maybeItem.isEmpty()) {

            BigDecimal totalAvailable = items.stream()
                    .map(i -> i.getUsableVolume() != null ? i.getUsableVolume() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            throw new RuntimeException(
                    "Not enough material in a single batch. Requested: " + required +
                            ", available: " + totalAvailable
            );
        }

        StockItem item = maybeItem.get();

        // subtract
        item.setUsableVolume(
                item.getUsableVolume().subtract(required)
        );

        return stockRepository.save(item);
    }

    // ---------------------------------------------------------
    // PAGINATION FOR PERFORMANCE (returns full StockItem objects)
    // ---------------------------------------------------------
    public org.springframework.data.domain.Page<StockItem> getPagedStock(int page, int size) {
        var pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return stockRepository.findAll(pageable);
    }

    public Page<StockListDto> getPagedFastFiltered(int page, int size, String woodType, String supplier, String fromDate) {
        Pageable pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by("arrivalDate").descending());

        LocalDate fromDateParsed = null;
        if (fromDate != null && !fromDate.isBlank()) {
            try {
                fromDateParsed = LocalDate.parse(fromDate);
            } catch (Exception ignored) {}
        }

        // Fetch all data with basic pagination
        List<StockItem> allItems = stockRepository.findAll();

        // Apply filters in memory
        LocalDate finalFromDateParsed = fromDateParsed;
        List<StockItem> filtered = allItems.stream()
                .filter(item -> {
                    if (woodType != null && !woodType.isBlank()) {
                        return item.getWoodType() != null &&
                                item.getWoodType().equalsIgnoreCase(woodType);
                    }
                    return true;
                })
                .filter(item -> {
                    if (supplier != null && !supplier.isBlank()) {
                        return item.getSupplier() != null &&
                                item.getSupplier().toLowerCase().contains(supplier.toLowerCase());
                    }
                    return true;
                })
                .filter(item -> {
                    if (finalFromDateParsed == null) return true;
                    if (item.getArrivalDate() == null) return true;
                    return !item.getArrivalDate().toLocalDate().isBefore(finalFromDateParsed);
                })
                .sorted((a, b) -> b.getArrivalDate().compareTo(a.getArrivalDate()))
                .collect(java.util.stream.Collectors.toList());

        // Convert to DTOs
        List<StockListDto> dtos = filtered.stream()
                .map(s -> new com.erapuit.backend.dto.StockListDto(
                        s.getId(), s.getDeliveryId(), s.getDeliveryPackageId(),
                        s.getPackageCode(), s.getSupplier(), s.getWoodType(),
                        s.getArrivalDate(), s.getTotalVolume(), s.getUsableVolume()
                ))
                .collect(java.util.stream.Collectors.toList());

        // Implement manual pagination
        int start = page * size;
        int end = Math.min(start + size, dtos.size());
        List<StockListDto> pagedContent = dtos.subList(start, Math.max(start, end));

        return new org.springframework.data.domain.PageImpl<>(
                pagedContent,
                pageable,
                dtos.size()
        );
    }

    public StockItem useForProductionByPackage(String deliveryPackageId, double usage) {

        if (usage <= 0) {
            throw new IllegalArgumentException("Usage must be positive");
        }

        StockItem item = stockRepository.findByDeliveryPackageId(UUID.fromString(deliveryPackageId))
                .orElseThrow(() -> new IllegalArgumentException("Material not found: " + deliveryPackageId));

        if (item.getUsableVolume().compareTo(BigDecimal.valueOf(usage)) < 0) {
            throw new IllegalArgumentException("Not enough usable volume in this package.");
        }

        // subtract usage
        item.setUsableVolume(item.getUsableVolume().subtract(BigDecimal.valueOf(usage)));

        return stockRepository.save(item);
    }


}
