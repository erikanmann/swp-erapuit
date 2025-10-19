package com.erapuit.backend;

import com.erapuit.backend.controller.DeliveryController;
import com.erapuit.backend.model.Delivery;
import com.erapuit.backend.service.DeliveryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DeliveryController.class)
@AutoConfigureMockMvc
public class DeliveryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DeliveryService deliveryService;

    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        objectMapper = new ObjectMapper().findAndRegisterModules();
    }

    @Test
    public void testGetDeliveries() throws Exception {
        Delivery d = new Delivery();
        d.setId(UUID.randomUUID());
        d.setSupplierName("Supplier A");
        d.setArrivalDate(OffsetDateTime.now());
        when(deliveryService.getAll()).thenReturn(List.of(d));

        mockMvc.perform(get("/api/deliveries"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].supplierName").value("Supplier A"));
    }

    @Test
    public void testCreateDelivery() throws Exception {
        Delivery delivery = new Delivery();
        delivery.setSupplierName("Supplier A");
        delivery.setSupplierRegCode("REG123");
        delivery.setSupplierAddress("123 Supplier St");
        delivery.setDriverName("Driver X");
        delivery.setTruckNo("TRK-001");
        delivery.setWaybillNo("WB-001");
        delivery.setWoodType("Oak");
        delivery.setArrivalDate(OffsetDateTime.now());
        delivery.setLogLengthCm(new BigDecimal("300"));
        delivery.setLogDiameterCm(new BigDecimal("50"));
        delivery.setTotalVolumeM3(new BigDecimal("15.5"));

        Delivery saved = new Delivery();
        saved.setId(UUID.randomUUID());
        saved.setSupplierName(delivery.getSupplierName());
        saved.setArrivalDate(delivery.getArrivalDate());

        when(deliveryService.save(any(Delivery.class))).thenReturn(saved);

        mockMvc.perform(post("/api/deliveries")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(delivery)))
                .andExpect(status().isCreated());

        // verify service was called
        verify(deliveryService).save(any(Delivery.class));
    }
}