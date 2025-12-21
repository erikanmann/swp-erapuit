package com.erapuit.backend.config;

import com.erapuit.backend.repository.DeliveryRepository;
import com.erapuit.backend.repository.StockRepository;
import com.erapuit.backend.service.StockService;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@TestConfiguration
@Profile("test-mvc")
public class TestBeans {
    @Bean DeliveryRepository deliveryRepository() {
        return Mockito.mock(DeliveryRepository.class);
    }
    @Bean StockRepository stockRepository() {
        return Mockito.mock(StockRepository.class);
    }
    @Bean StockService stockService() {
        return Mockito.mock(StockService.class);
    }
}
