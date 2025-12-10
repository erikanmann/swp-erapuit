package com.erapuit.backend;

import com.erapuit.backend.model.StockItem;
import com.erapuit.backend.repository.StockRepository;
import com.erapuit.backend.service.StockService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class StockServiceTest {

    @Test
    void useForProduction_shouldReduceUsableVolume() {
        StockRepository repo = Mockito.mock(StockRepository.class);
        StockService service = new StockService(repo);

        StockItem item = new StockItem();
        item.setWoodType("Mänd");
        item.setSupplier("Tarnija");
        item.setArrivalDate(OffsetDateTime.now());
        item.setTotalVolume(BigDecimal.valueOf(10));
        item.setUsableVolume(BigDecimal.valueOf(10));

        when(repo.findByWoodTypeIgnoreCase("Mänd")).thenReturn(List.of(item));
        when(repo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        StockItem result = service.useForProductionByType("Mänd", 2.5);

        assertThat(result.getUsableVolume()).isEqualTo(BigDecimal.valueOf(7.5));
    }

    @Test
    void useForProduction_notEnoughStock_throwsError() {
        StockRepository repo = Mockito.mock(StockRepository.class);
        StockService service = new StockService(repo);

        StockItem item = new StockItem();
        item.setWoodType("Kask");
        item.setSupplier("Tarnija");
        item.setArrivalDate(OffsetDateTime.now());
        item.setTotalVolume(BigDecimal.valueOf(5));
        item.setUsableVolume(BigDecimal.valueOf(1));

        when(repo.findByWoodTypeIgnoreCase("Kask")).thenReturn(List.of(item));

        assertThrows(RuntimeException.class, () -> service.useForProductionByType("Kask", 3.0));
    }
}
