package com.erapuit.backend;

import com.erapuit.backend.webtest.config.TestSecurityConfig;
import com.erapuit.backend.controller.FileUploadController;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.junit.jupiter.api.Test;
import org.mockito.MockedConstruction;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.io.InputStream;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mockConstruction;
import static org.mockito.Mockito.mockStatic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FileUploadController.class)
@Import(TestSecurityConfig.class)
@AutoConfigureMockMvc
class FileUploadControllerTest {

    @Autowired private MockMvc mockMvc;

    @Test
    void parseWaybill_returnsParsedData_whenPDFContainsExpectedText() throws Exception {

        // mock the static PDDocument.load(InputStream)
        try (MockedStatic<PDDocument> mockDoc = mockStatic(PDDocument.class)) {
            PDDocument fakeDoc = new PDDocument();
            mockDoc.when(() -> PDDocument.load(any(InputStream.class))).thenReturn(fakeDoc);

            // mock construction of PDFTextStripper (cleaner than mockStatic here)
            try (MockedConstruction<PDFTextStripper> mockStripper = mockConstruction(
                    PDFTextStripper.class,
                    (mock, context) -> {
                        // When getText(fakeDoc) is called, return fake text
                        org.mockito.Mockito.when(mock.getText(any(PDDocument.class)))
                                .thenReturn("Riigimetsa Majandamise Keskus VEOSELEHT NR RMK123456 Juhi nimi Test Juht Veoki number ABC123");
                    })) {

                MockMultipartFile fakePdf = new MockMultipartFile(
                        "file", "waybill.pdf", "application/pdf", new byte[]{1, 2, 3});

                mockMvc.perform(multipart("/api/file/parse-waybill").file(fakePdf))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.supplierName").value("RMK"))
                        .andExpect(jsonPath("$.waybillNo").value("RMK123456"));
            }
        }
    }

    @Test
    void parseWaybill_returnsError_onInvalidFile() throws Exception {
        MockMultipartFile broken = new MockMultipartFile("file", "broken.pdf", "application/pdf", new byte[0]);

        mockMvc.perform(multipart("/api/file/parse-waybill").file(broken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }
}
