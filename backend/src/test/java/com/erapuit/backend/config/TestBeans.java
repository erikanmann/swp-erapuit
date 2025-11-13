package com.erapuit.backend.config;

import com.erapuit.backend.repository.DeliveryRepository;
import com.erapuit.backend.repository.StockRepository;
import com.erapuit.backend.service.StockService;
import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("test")
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
