package com.erapuit.backend;

import com.erapuit.backend.evr.EvrApiClient;
import com.erapuit.backend.model.Delivery;
import com.erapuit.backend.repository.DeliveryRepository;
import com.erapuit.backend.repository.StockRepository;
import com.erapuit.backend.service.DeliveryService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class DeliveryServiceTest {

    @Test
    void saveDelivery_shouldStoreAndReturnDelivery() {
        DeliveryRepository repo = Mockito.mock(DeliveryRepository.class);
        EvrApiClient evr = Mockito.mock(EvrApiClient.class);
        StockRepository stockRepo = Mockito.mock(StockRepository.class);

        DeliveryService service = new DeliveryService(repo, evr, stockRepo);

        Delivery delivery = new Delivery();
        delivery.setSupplierName("RMK");
        delivery.setWaybillNo("WB-001");

        when(repo.save(any(Delivery.class))).thenReturn(delivery);

        Delivery saved = service.save(delivery);

        assertThat(saved.getSupplierName()).isEqualTo("RMK");
        verify(repo).save(delivery);
    }

    @Test
    void saveDelivery_duplicateWaybill_throwsError() {
        DeliveryRepository repo = Mockito.mock(DeliveryRepository.class);
        EvrApiClient evr = Mockito.mock(EvrApiClient.class);
        StockRepository stockRepo = Mockito.mock(StockRepository.class);

        DeliveryService service = new DeliveryService(repo, evr, stockRepo);

        Delivery d1 = new Delivery();
        d1.setWaybillNo("WB-001");

        when(repo.findByWaybillNo("WB-001")).thenReturn(Optional.of(d1));

        Delivery newDelivery = new Delivery();
        newDelivery.setWaybillNo("WB-001");

        assertThrows(
                IllegalArgumentException.class,
                () -> service.save(newDelivery)
        );
    }
}
