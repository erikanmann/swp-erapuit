package com.erapuit.backend;

import com.erapuit.backend.controller.StockController;
import com.erapuit.backend.model.Production;
import com.erapuit.backend.model.StockItem;
import com.erapuit.backend.repository.DeliveryRepository;
import com.erapuit.backend.repository.StockRepository;
import com.erapuit.backend.service.StockService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StockController.class)
@AutoConfigureMockMvc
@Import(com.erapuit.backend.config.TestBeans.class)
class StockControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DeliveryRepository deliveryRepository;
    @MockBean private StockRepository stockRepository;
    @MockBean private StockService stockService;

    private ObjectMapper mapper;

    @BeforeEach
    void setup() {
        mapper = new ObjectMapper().findAndRegisterModules();
    }

    @Test
    void getStockByWoodType_returnsList() throws Exception {
        StockItem item = new StockItem();
        item.setWoodType("Kuusk");
        item.setSupplier("Tarnija");
        item.setArrivalDate(OffsetDateTime.now());
        item.setTotalVolume(BigDecimal.valueOf(10));
        item.setUsableVolume(BigDecimal.valueOf(10));

        when(stockService.getByWoodType("Kuusk")).thenReturn(List.of(item));

        mockMvc.perform(get("/api/stock/by-wood-type?woodType=Kuusk"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].woodType").value("Kuusk"));
    }

}
