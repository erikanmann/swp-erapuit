package com.erapuit.backend;

import com.erapuit.backend.controller.ShipmentController;
import com.erapuit.backend.model.Shipment;
import com.erapuit.backend.model.ShipmentItem;
import com.erapuit.backend.repository.ShipmentItemRepository;
import com.erapuit.backend.repository.ShipmentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ShipmentController.class)
@AutoConfigureMockMvc
class ShipmentControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private ShipmentRepository shipmentRepository;
    @MockBean private ShipmentItemRepository shipmentItemRepository;
    private ObjectMapper mapper;

    @BeforeEach
    void setup() {
        mapper = new ObjectMapper().findAndRegisterModules();
    }

    @Test
    void getAllShipments_returnsList() throws Exception {
        Shipment s = new Shipment();
        s.setId(UUID.randomUUID());
        s.setDeliveryNoteNo("DN123");
        s.setCustomer("Client X");
        s.setDateSent(OffsetDateTime.now());

        when(shipmentRepository.findAll()).thenReturn(List.of(s));

        mockMvc.perform(get("/api/shipments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].deliveryNoteNo").value("DN123"));
    }

    @Test
    void getShipmentById_returnsShipment() throws Exception {
        UUID id = UUID.randomUUID();
        Shipment s = new Shipment();
        s.setId(id);
        s.setDeliveryNoteNo("DN999");
        when(shipmentRepository.findById(id)).thenReturn(Optional.of(s));

        mockMvc.perform(get("/api/shipments/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deliveryNoteNo").value("DN999"));
    }

    @Test
    void createShipment_returnsCreatedShipment() throws Exception {
        Shipment input = new Shipment();
        input.setDeliveryNoteNo("DN555");
        input.setCustomer("Client Y");

        Shipment saved = new Shipment();
        saved.setId(UUID.randomUUID());
        saved.setDeliveryNoteNo("DN555");
        saved.setCustomer("Client Y");

        when(shipmentRepository.save(any(Shipment.class))).thenReturn(saved);

        mockMvc.perform(post("/api/shipments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(input)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.deliveryNoteNo").value("DN555"));
    }

    @Test
    void updateShipment_updatesAndReturnsShipment() throws Exception {
        UUID id = UUID.randomUUID();
        Shipment existing = new Shipment();
        existing.setId(id);
        existing.setDeliveryNoteNo("DN1");
        existing.setCustomer("Old Customer");

        Shipment updated = new Shipment();
        updated.setCustomer("New Customer");

        when(shipmentRepository.findById(id)).thenReturn(Optional.of(existing));
        when(shipmentRepository.save(any(Shipment.class))).thenReturn(existing);

        mockMvc.perform(put("/api/shipments/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(updated)))
                .andExpect(status().isOk());
    }
}
