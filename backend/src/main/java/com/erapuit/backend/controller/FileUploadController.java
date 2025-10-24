package com.erapuit.backend.controller;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/file")
@CrossOrigin(origins = "http://localhost:3000")
public class FileUploadController {

    @PostMapping("/parse-waybill")
    public ResponseEntity<Map<String, Object>> parseWaybill(@RequestParam("file") MultipartFile file) {
        Map<String, Object> data = new HashMap<>();

        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            String text = new PDFTextStripper().getText(document);
            text = text.replaceAll("\\s+", " ");

            // --- Supplier ---
            if (text.contains("Riigimetsa Majandamise Keskus")) {
                data.put("supplierName", "RMK");
                data.put("supplierAddress", "Sagadi küla, Haljala vald, Lääne-Viru maakond");
            } else if (text.contains("Estfor")) {
                data.put("supplierName", "Estfor OÜ");
            }

            // --- Waybill Number ---
            Matcher waybillMatcher = Pattern.compile("VEOSELEHT NR\\s+(RMK\\d{6,})").matcher(text);
            if (waybillMatcher.find()) {
                data.put("waybillNo", waybillMatcher.group(1));
            }

            // --- Arrival Date ---
            Matcher dateMatcher1 = Pattern.compile("Staatus: Sihtkohas\\s+(\\d{2}\\.\\d{2}\\.\\d{4})").matcher(text);
            Matcher dateMatcher2 = Pattern.compile("Loomise kpv:\\s*(\\d{2}\\.\\d{2}\\.\\d{4})").matcher(text);
            if (dateMatcher1.find()) {
                data.put("arrivalDate", dateMatcher1.group(1));
            } else if (dateMatcher2.find()) {
                data.put("arrivalDate", dateMatcher2.group(1));
            }

            // --- Total Volume (tm) ---
            Matcher volumeMatcher = Pattern.compile("Kokku\\s+(\\d{1,3},\\d{3})\\s*tm").matcher(text);
            if (volumeMatcher.find()) {
                String volume = volumeMatcher.group(1).replace(",", ".");
                data.put("totalVolumeTm", Double.parseDouble(volume));
            }

            // --- Wood Type ---
            if (text.contains("Kuusk")) data.put("woodType", "Kuusk");
            else if (text.contains("Mänd")) data.put("woodType", "Mänd");
            else if (text.contains("Kask")) data.put("woodType", "Kask");

            // --- Driver Name ---
            Matcher driverMatcher = Pattern.compile("Juhi nimi\\s+([A-ZÕÄÖÜa-zõäöü\\s\\-]+?)\\s+Juhi isikukood").matcher(text);
            if (driverMatcher.find()) {
                data.put("driverName", driverMatcher.group(1).trim());
            }

            // --- Truck Number ---
            Matcher truckMatcher = Pattern.compile("Veoki number\\s+([A-Z0-9]{5,7})").matcher(text);
            if (truckMatcher.find()) {
                data.put("truckNo", truckMatcher.group(1));
            }

        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to read PDF: " + e.getMessage()));
        }

        return ResponseEntity.ok(data);
    }

}
