package com.erapuit.backend;

import com.erapuit.backend.model.Delivery;
import com.erapuit.backend.model.StockItem;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Map;

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

    @Test
    void createDelivery_andVerifyStockUpdated() {
        // --- 1. Create a new delivery ---
        Delivery delivery = new Delivery();
        delivery.setSupplierName("RMK");
        delivery.setSupplierRegCode("REG123");
        delivery.setSupplierAddress("Test Address");
        delivery.setDriverName("Driver X");
        delivery.setTruckNo("TRUCK123");
        delivery.setWaybillNo("WB-" + System.currentTimeMillis());
        delivery.setWoodType("Kuusk");
        delivery.setArrivalDate(OffsetDateTime.now());
        delivery.setTotalVolumeTm(new BigDecimal("10.0"));

        ResponseEntity<Delivery> response = restTemplate.postForEntity(url("/api/deliveries"), delivery, Delivery.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();

        // --- 2. Verify delivery appears in stock ---
        ResponseEntity<StockItem[]> stockResp = restTemplate.getForEntity(url("/api/stock/by-wood-type?woodType=Kuusk"), StockItem[].class);
        assertThat(stockResp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(stockResp.getBody()).isNotNull();
    }

    @Test
    void production_usesMaterial_andUpdatesStock() {
        // --- 1. Use material ---
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String productionJson = """
            {"woodType": "Kuusk", "usage": 2.0}
        """;

        HttpEntity<String> entity = new HttpEntity<>(productionJson, headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                url("/api/production/use-material"),
                HttpMethod.PUT,
                entity,
                Map.class
        );

        // --- 2. Assert response ---
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsKey("usableVolume");
    }
}
