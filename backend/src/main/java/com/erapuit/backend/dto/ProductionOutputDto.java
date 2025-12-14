package com.erapuit.backend.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ProductionOutputDto(
        UUID id,
        String productName,
        Integer availableCount,
        OffsetDateTime producedAt
) {}
