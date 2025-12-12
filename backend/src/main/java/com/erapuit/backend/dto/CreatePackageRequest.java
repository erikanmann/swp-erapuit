package com.erapuit.backend.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record CreatePackageRequest(
        UUID productId,
        Integer count,
        BigDecimal volumeM3,
        BigDecimal weightKg,
        String location
) {}
