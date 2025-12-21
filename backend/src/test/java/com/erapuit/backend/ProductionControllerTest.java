package com.erapuit.backend;

import com.erapuit.backend.webtest.config.TestSecurityConfig;
import com.erapuit.backend.controller.ProductionController;
import com.erapuit.backend.model.StockItem;
import com.erapuit.backend.service.StockService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import com.erapuit.backend.service.ProductionOutputService;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductionController.class)
@Import(TestSecurityConfig.class)
@AutoConfigureMockMvc
class ProductionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StockService stockService;

    @MockBean
    private ProductionOutputService productionOutputService;

    private ObjectMapper mapper;

    @BeforeEach
    void setup() {
        mapper = new ObjectMapper().findAndRegisterModules();
    }

    @Test
    void useMaterial_returnsUpdatedStockItem() throws Exception {

        StockItem updated = new StockItem();
        updated.setUsableVolume(BigDecimal.valueOf(8.0));

        when(stockService.useForProductionByPackage("123", 2.0))
                .thenReturn(updated);

        mockMvc.perform(
                        put("/api/production/use-material/123")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                        { "usage": 2.0 }
                    """)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.usableVolume").value(8.0));
    }
}
