package com.erapuit.backend.dto;

import java.util.List;
import java.util.UUID;

public record CreatePackageWithItemsRequest(
        String location,
        List<Item> items
) {
    public record Item(
            UUID productionOutputId,
            Integer count
    ) {}
}
