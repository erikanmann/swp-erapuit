package com.erapuit.backend.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductionOutputRequest(
        UUID productId,
        int count,
        BigDecimal volumeM3,
        String location
) {}
