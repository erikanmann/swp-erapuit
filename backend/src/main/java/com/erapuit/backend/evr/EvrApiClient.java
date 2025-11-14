package com.erapuit.backend.evr;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.erapuit.backend.dto.IncomingWaybillDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EvrApiClient {

    @Value("${evr.base-url}")
    private String baseUrl;

    @Value("${evr.secret-key}")
    private String secretKey;

    @Value("${evr.receiver-code}")
    private String receiverCode;

    @Value("${evr.place-of-delivery-code}")
    private String placeOfDeliveryCode;

    private final RestTemplate restTemplate = new RestTemplate();

    // ========================================================================
    // 1) WAYBILL LIST (päise info)
    // ========================================================================

    public List<IncomingWaybillDto> getIncomingLoads() {

        OffsetDateTime createdAfter = OffsetDateTime.now(ZoneOffset.UTC).minusDays(30);
        OffsetDateTime createdBefore = OffsetDateTime.now(ZoneOffset.UTC);

        String url = UriComponentsBuilder
                .fromHttpUrl(baseUrl + "/api/waybills")
                .queryParam("receiver_code", receiverCode)
                .queryParam("place_of_delivery_code", placeOfDeliveryCode)
                .queryParam("created_after", createdAfter.toString())
                .queryParam("created_before", createdBefore.toString())
                .queryParam("page_size", 200)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("EVR-APIKEY", secretKey);
        headers.set("EVR-LANGUAGE", "et");

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<WaybillPage> response =
                restTemplate.exchange(url, HttpMethod.GET, entity, WaybillPage.class);

        WaybillPage body = response.getBody();

        if (body == null || body.pageResult == null) {
            return Collections.emptyList();
        }

        return body.pageResult.stream()
                .map(Waybill::toIncomingDto)
                .collect(Collectors.toList());
    }

    // ========================================================================
    // 2) WAYBILL DETAIL — see on see, kust me saame kogused + sordid
    // ========================================================================

    public WaybillDetail getWaybillDetail(String number) {

        String url = baseUrl + "/api/waybills/" + number;

        HttpHeaders headers = new HttpHeaders();
        headers.set("EVR-APIKEY", secretKey);
        headers.set("EVR-LANGUAGE", "et");

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<WaybillDetail> response =
                restTemplate.exchange(url, HttpMethod.GET, entity, WaybillDetail.class);

        return response.getBody();
    }

    // ========================================================================
    // DTO classes for EVR API
    // ========================================================================

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class WaybillPage {
        public List<Waybill> pageResult;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Waybill {
        public String number;
        public String status;
        public OffsetDateTime departureTime;
        public Double mass;
        public Transport transport;
        public Party owner;
        public Party receiver;
        public PlaceOfDelivery placeOfDelivery;

        public IncomingWaybillDto toIncomingDto() {
            IncomingWaybillDto dto = new IncomingWaybillDto();
            dto.setWaybillNumber(number);
            dto.setStatus(status);
            dto.setDepartureTime(departureTime != null ? departureTime.toString() : null);
            dto.setMass(mass);

            if (transport != null) {
                dto.setTruckNo(transport.vanRegistrationNumber);
                dto.setTrailerNo(transport.trailerRegistrationNumber);
                dto.setDriverName(transport.driverName);
                dto.setDriverPhone(transport.driverPhone);
            }
            if (owner != null) {
                dto.setWoodOwnerName(owner.name);
            }
            if (receiver != null) {
                dto.setReceiverName(receiver.name);
            }
            if (placeOfDelivery != null) {
                dto.setPlaceOfDeliveryName(placeOfDelivery.name);
            }

            return dto;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Transport {
        public String driverName;
        public String driverPhone;
        public String vanRegistrationNumber;
        public String trailerRegistrationNumber;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Party {
        public String name;
        public String code;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PlaceOfDelivery {
        public String name;
        public String code;
    }

    // ========================================================================
    // DETAIL API DTO
    // ========================================================================

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class WaybillDetail {
        public String number;

        public Owner owner;
        public OffsetDateTime unloadingTime;
        public OffsetDateTime departureTime;
        public List<Shipment> shipments;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Shipment {
        public List<Item> items;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Item {
        public Double amount;
        public String unitCode;
        public Assortment assortment;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Assortment {
        public String code;
        public String name;
    }
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Owner {
        public String name;
        public String code;
        public Address address;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Address {
        public String street;
        public String city;
        public String county;
        public String countryCode;
    }

}
