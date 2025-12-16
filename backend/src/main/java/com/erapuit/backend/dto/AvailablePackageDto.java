package com.erapuit.backend.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record AvailablePackageDto(
        UUID id,
        UUID productId,
        String productName,
        Integer pieceCount,
        BigDecimal volumeM3,
        BigDecimal weightKg,
        String location
) {}
