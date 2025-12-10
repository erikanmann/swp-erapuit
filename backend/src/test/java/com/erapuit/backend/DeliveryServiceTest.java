package com.erapuit.backend;

import com.erapuit.backend.evr.EvrApiClient;
import com.erapuit.backend.model.Delivery;
import com.erapuit.backend.model.DeliveryPackage;
import com.erapuit.backend.repository.DeliveryRepository;
import com.erapuit.backend.repository.StockRepository;
import com.erapuit.backend.service.DeliveryPackageService;
import com.erapuit.backend.service.DeliveryService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class DeliveryServiceTest {

    @Test
    void saveDelivery_shouldStoreAndReturnDelivery() {
        DeliveryRepository repo = Mockito.mock(DeliveryRepository.class);
        EvrApiClient evr = Mockito.mock(EvrApiClient.class);
        StockRepository stockRepo = Mockito.mock(StockRepository.class);
        DeliveryPackageService pkgService = Mockito.mock(DeliveryPackageService.class);

        DeliveryService service = new DeliveryService(repo, evr, stockRepo, pkgService);

        Delivery delivery = new Delivery();
        delivery.setSupplierName("RMK");
        delivery.setWaybillNo("WB-001");

        when(repo.save(any(Delivery.class))).thenAnswer(inv -> {
            Delivery d = inv.getArgument(0);
            d.setId(UUID.randomUUID());
            return d;
        });

        // avoid NPE in createStockForPackages
        when(pkgService.createAutomaticPackage(any(Delivery.class))).thenAnswer(inv -> {
            Delivery d = inv.getArgument(0);
            DeliveryPackage p = new DeliveryPackage();
            p.setId(UUID.randomUUID());
            p.setDeliveryId(d.getId());
            return p;
        });
        when(stockRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Delivery saved = service.save(delivery);

        assertThat(saved.getSupplierName()).isEqualTo("RMK");
        assertThat(saved.getId()).isNotNull();
        verify(repo).save(delivery);
        verify(pkgService).createAutomaticPackage(saved);
        verify(stockRepo, atLeastOnce()).save(any());
    }

    @Test
    void saveDelivery_duplicateWaybill_throwsError() {
        DeliveryRepository repo = Mockito.mock(DeliveryRepository.class);
        EvrApiClient evr = Mockito.mock(EvrApiClient.class);
        StockRepository stockRepo = Mockito.mock(StockRepository.class);
        DeliveryPackageService pkgService = Mockito.mock(DeliveryPackageService.class);

        DeliveryService service = new DeliveryService(repo, evr, stockRepo, pkgService);

        Delivery d1 = new Delivery();
        d1.setWaybillNo("WB-001");

        when(repo.findByWaybillNo("WB-001")).thenReturn(Optional.of(d1));

        Delivery newDelivery = new Delivery();
        newDelivery.setWaybillNo("WB-001");

        assertThrows(IllegalArgumentException.class, () -> service.save(newDelivery));
        verify(repo, never()).save(any());
    }

    @Test
    void deleteDeliveryAlsoRemovesStock() {
        DeliveryRepository repo = mock(DeliveryRepository.class);
        StockRepository stockRepo = mock(StockRepository.class);
        EvrApiClient evrApi = mock(EvrApiClient.class);
        DeliveryPackageService pkgService = mock(DeliveryPackageService.class);

        DeliveryService service = new DeliveryService(repo, evrApi, stockRepo, pkgService);

        UUID id = UUID.randomUUID();
        Delivery d = new Delivery();
        d.setId(id);

        when(repo.findById(id)).thenReturn(Optional.of(d));

        boolean result = service.deleteById(id);

        assertThat(result).isTrue();
        verify(stockRepo).deleteByDeliveryId(id);
        verify(repo).delete(d);
    }
}
