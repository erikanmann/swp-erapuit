package com.erapuit.backend;

import com.erapuit.backend.model.Delivery;
import com.erapuit.backend.model.Package;
import com.erapuit.backend.model.Shipment;
import com.erapuit.backend.model.ShipmentItem;
import com.erapuit.backend.model.StockItem;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class FullWorkflowE2ETest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String url(String path) {
        return "http://localhost:" + port + path;
    }

    private Delivery createDelivery(String woodType, double volume) {
        Delivery delivery = new Delivery();
        delivery.setSupplierName("RMK");
        delivery.setSupplierRegCode("REG123");
        delivery.setSupplierAddress("Test Address");
        delivery.setDriverName("Driver X");
        delivery.setTruckNo("TRUCK123");
        delivery.setWaybillNo("WB-" + System.nanoTime());
        delivery.setWoodType(woodType);
        delivery.setArrivalDate(OffsetDateTime.now());
        delivery.setTotalVolumeTm(BigDecimal.valueOf(volume));

        ResponseEntity<Delivery> response =
                restTemplate.postForEntity(url("/api/deliveries"), delivery, Delivery.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isNotNull();

        return response.getBody();
    }

    @Test
    void createDelivery_andVerifyStockUpdated() {
        // UC1 + UC2: register delivery, then check warehouse
        createDelivery("Kuusk", 10.0);

        ResponseEntity<StockItem[]> stockResp =
                restTemplate.getForEntity(url("/api/stock/by-wood-type?woodType=Kuusk"), StockItem[].class);

        assertThat(stockResp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(stockResp.getBody()).isNotNull();
        assertThat(stockResp.getBody().length).isGreaterThan(0);
    }

    @Test
    void production_usesMaterial_andUpdatesStock() {
        // ensure Kuusk exists
        createDelivery("Kuusk", 10.0);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String productionJson = """
                {"woodType": "Kuusk", "usage": 2.0}
                """;

        HttpEntity<String> entity = new HttpEntity<>(productionJson, headers);
        ResponseEntity<StockItem> response = restTemplate.exchange(
                url("/api/production/use-material"),
                HttpMethod.PUT,
                entity,
                StockItem.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getUsableVolume()).isNotNull();
    }

    @Test
    void createPackageAndShipment_linksPackageToShipmentItems() {
        // UC3: create package + shipment and ensure items created

        // 1) create package
        Package pkg = new Package();
        pkg.setProductId(UUID.randomUUID());
        pkg.setWeightKg(BigDecimal.valueOf(500));
        pkg.setCount(10);
        pkg.setVolumeM3(BigDecimal.valueOf(2.5));
        pkg.setLocation("L1");

        ResponseEntity<Package> pkgResp =
                restTemplate.postForEntity(url("/api/packages"), pkg, Package.class);

        assertThat(pkgResp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(pkgResp.getBody()).isNotNull();
        UUID packageId = pkgResp.getBody().getId();
        assertThat(packageId).isNotNull();

        // 2) create shipment using that package
        Shipment shipment = new Shipment();
        shipment.setDeliveryNoteNo("DN-" + System.nanoTime());
        shipment.setCustomer("Client X");
        shipment.setVehicleNo("TRUCK-1");
        shipment.setTransportCompany("TransCo");
        shipment.setPackageIds(List.of(packageId));

        ResponseEntity<Shipment> shipResp =
                restTemplate.postForEntity(url("/api/shipments"), shipment, Shipment.class);

        assertThat(shipResp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(shipResp.getBody()).isNotNull();
        UUID shipmentId = shipResp.getBody().getId();
        assertThat(shipmentId).isNotNull();

        // 3) verify ShipmentItem row exists via API
        ResponseEntity<ShipmentItem[]> itemsResp =
                restTemplate.getForEntity(url("/api/shipments/" + shipmentId + "/items"), ShipmentItem[].class);

        assertThat(itemsResp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(itemsResp.getBody()).isNotNull();
        assertThat(itemsResp.getBody().length).isEqualTo(1);
        assertThat(itemsResp.getBody()[0].getPackageId()).isEqualTo(packageId);
    }
}
