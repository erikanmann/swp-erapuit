package com.erapuit.backend;

import com.erapuit.backend.controller.ProductionController;
import com.erapuit.backend.model.Production;
import com.erapuit.backend.model.StockItem;
import com.erapuit.backend.service.StockService;
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

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductionController.class)
@AutoConfigureMockMvc
class ProductionControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private StockService stockService;
    private ObjectMapper mapper;

    @BeforeEach
    void setup() {
        mapper = new ObjectMapper().findAndRegisterModules();
    }

    @Test
    void useMaterial_returnsUpdatedStockItem() throws Exception {
        StockItem updated = new StockItem();
        updated.setWoodType("Kuusk");
        updated.setUsableVolume(BigDecimal.valueOf(8.0));

        when(stockService.useForProductionByType(eq("Kuusk"), eq(2.0)))
                .thenReturn(updated);

        Production prod = new Production();
        prod.setWoodType("Kuusk");
        prod.setUsage(2.0);

        mockMvc.perform(put("/api/production/use-material")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(prod)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.usableVolume").value(8.0));
    }
}
