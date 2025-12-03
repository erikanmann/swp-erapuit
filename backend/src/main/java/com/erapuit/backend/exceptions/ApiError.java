package com.erapuit.backend.exceptions;

import java.time.OffsetDateTime;

public class ApiError {

    private OffsetDateTime timestamp = OffsetDateTime.now();
    private int status;
    private String message;

    public ApiError(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public OffsetDateTime getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}
